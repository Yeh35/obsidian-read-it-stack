import { App, TFile, getAllTags } from "obsidian";
import { BookData, BookStatus, CodeBlockOptions } from "../types";
import { formatTitle, DEFAULT_TITLE_FORMAT } from "../utils/templateUtils";

export class BookDataParser {
    private app: App;
    private spineImageField: string;

    constructor(app: App, spineImageField: string = "spine") {
        this.app = app;
        this.spineImageField = spineImageField;
    }

    setSpineImageField(field: string): void {
        this.spineImageField = field;
    }

    getBooks(options: CodeBlockOptions): BookData[] {
        let files = this.app.vault.getMarkdownFiles();

        if (options.folder) {
            const folderPath = this.normalizeFolderPath(options.folder);
            files = files.filter(file => file.path.startsWith(folderPath));
        }

        const books: BookData[] = [];

        for (const file of files) {
            const bookData = this.parseFile(file);
            if (bookData && this.matchesFilters(bookData, options)) {
                const template = options.titleFormat || DEFAULT_TITLE_FORMAT;
                bookData.displayTitle = formatTitle(template, bookData);
                books.push(bookData);
            }
        }

        this.sortBooks(books, options);

        if (options.limit && options.limit > 0) {
            return books.slice(0, options.limit);
        }

        return books;
    }

    private parseFile(file: TFile): BookData | null {
        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache?.frontmatter) return null;

        const fm = cache.frontmatter;

        // Require at least pages to be considered a book
        if (!fm.pages && !fm.page_count) return null;

        const tags = cache ? (getAllTags(cache) || []) : [];

        // Extract spine image path
        const spineImageRaw = this.extractSpineImage(fm);
        const spineImage = spineImageRaw
            ? this.resolveImagePath(spineImageRaw, file.path)
            : null;

        return {
            title: fm.title || fm.book_title || fm["book-title"] || file.basename,
            filename: file.basename,
            pages: this.parseNumber(fm.pages || fm.page_count, 200) ?? 200,
            color: fm.color || fm.spine_color || null,
            spineImage: spineImage,
            status: this.parseStatus(fm.status),
            filePath: file.path,
            tags: tags,
            author: fm.author,
            rating: this.parseNumber(fm.rating, undefined),
            dateFinished: fm.date_finished || fm.finished,
            frontmatter: { ...fm }
        };
    }

    private extractSpineImage(fm: Record<string, unknown>): string | null {
        // Check configured field name first
        const configuredValue = fm[this.spineImageField];
        if (typeof configuredValue === "string" && configuredValue.trim()) {
            return configuredValue.trim();
        }

        // Check common variations as fallback
        const variations = [
            "spine", "spine_image", "spineImage", "spine-image",
            "book_spine", "bookSpine", "book-spine"
        ];

        for (const field of variations) {
            if (field === this.spineImageField) continue;
            const value = fm[field];
            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }
        }

        return null;
    }

    private resolveImagePath(imagePath: string, sourcePath: string): string | null {
        // 1. External URL (http/https)
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }

        let resolvedPath: string | null = null;

        // 2. Wiki-link format: [[image.png]] or [[image.png|alias]]
        if (imagePath.startsWith("[[") && imagePath.endsWith("]]")) {
            const linkPath = imagePath.slice(2, -2).split("|")[0].trim();
            const file = this.app.metadataCache.getFirstLinkpathDest(linkPath, sourcePath);
            if (file) {
                resolvedPath = file.path;
            }
        }
        // 3. Markdown link format: ![](path/to/image.png) or ![alt](path)
        else if (imagePath.startsWith("![")) {
            const match = imagePath.match(/!\[.*?\]\((.*?)\)/);
            if (match) {
                const extractedPath = match[1];
                if (extractedPath.startsWith("http://") || extractedPath.startsWith("https://")) {
                    return extractedPath;
                }
                const file = this.app.metadataCache.getFirstLinkpathDest(extractedPath, sourcePath);
                if (file) {
                    resolvedPath = file.path;
                }
            }
        }
        // 4. Vault absolute path (starts with /)
        else if (imagePath.startsWith("/")) {
            resolvedPath = imagePath.slice(1);
        }
        // 5. Relative path or plain filename
        else {
            const file = this.app.metadataCache.getFirstLinkpathDest(imagePath, sourcePath);
            if (file) {
                resolvedPath = file.path;
            } else {
                resolvedPath = imagePath;
            }
        }

        // Convert to vault resource URI
        if (resolvedPath) {
            const file = this.app.vault.getAbstractFileByPath(resolvedPath);
            if (file instanceof TFile) {
                return this.app.vault.getResourcePath(file);
            }
        }

        return null;
    }

    private parseStatus(value: unknown): BookStatus {
        if (typeof value !== "string") return "to-read";
        const normalized = value.toLowerCase().trim();

        const statusMap: Record<string, BookStatus> = {
            "reading": "reading",
            "in progress": "reading",
            "in-progress": "reading",
            "done": "done",
            "finished": "done",
            "complete": "done",
            "completed": "done",
            "read": "done",
            "to-read": "to-read",
            "to read": "to-read",
            "want to read": "to-read",
            "tbr": "to-read",
            "abandoned": "abandoned",
            "dnf": "abandoned"
        };

        return statusMap[normalized] || "to-read";
    }

    private parseNumber(value: unknown, defaultValue: number | undefined): number | undefined {
        if (typeof value === "number") return value;
        if (typeof value === "string") {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? defaultValue : parsed;
        }
        return defaultValue;
    }

    private matchesFilters(book: BookData, options: CodeBlockOptions): boolean {
        if (options.tag) {
            const normalizedTag = options.tag.toLowerCase();
            const hasTag = book.tags.some(t =>
                t.toLowerCase() === normalizedTag ||
                t.toLowerCase().startsWith(normalizedTag + "/")
            );
            if (!hasTag) return false;
        }

        if (options.status && options.status.length > 0) {
            if (!options.status.includes(book.status)) return false;
        }

        return true;
    }

    private sortBooks(books: BookData[], options: CodeBlockOptions): void {
        const sortBy = options.sortBy || "title";
        const order = options.sortOrder === "desc" ? -1 : 1;

        books.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case "title":
                    comparison = a.title.localeCompare(b.title);
                    break;
                case "pages":
                    comparison = (a.pages || 0) - (b.pages || 0);
                    break;
                case "rating":
                    comparison = (a.rating || 0) - (b.rating || 0);
                    break;
                case "dateFinished":
                    comparison = (a.dateFinished || "").localeCompare(b.dateFinished || "");
                    break;
            }

            return comparison * order;
        });
    }

    private normalizeFolderPath(folder: string): string {
        let normalized = folder.replace(/^\/+|\/+$/g, "");
        return normalized + "/";
    }
}
