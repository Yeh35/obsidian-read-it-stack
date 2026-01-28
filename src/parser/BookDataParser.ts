import { App, TFile, getAllTags } from "obsidian";
import { BookData, BookStatus, CodeBlockOptions } from "../types";
import { formatTitle, DEFAULT_TITLE_FORMAT } from "../utils/templateUtils";

export class BookDataParser {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    async getBooks(options: CodeBlockOptions): Promise<BookData[]> {
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

        return {
            title: fm.title || fm.book_title || fm["book-title"] || file.basename,
            filename: file.basename,
            pages: this.parseNumber(fm.pages || fm.page_count, 200) ?? 200,
            color: fm.color || fm.spine_color || null,
            status: this.parseStatus(fm.status),
            filePath: file.path,
            tags: tags,
            author: fm.author,
            rating: this.parseNumber(fm.rating, undefined),
            dateFinished: fm.date_finished || fm.finished,
            frontmatter: { ...fm }
        };
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
