import { App, TFile } from "obsidian";
import { ReadItStackSettings, RenderedBook } from "../types";
import { adjustColorBrightness, getContrastTextColor } from "../utils/colorUtils";

export class BookSpineRenderer {
    private app: App;
    private settings: ReadItStackSettings;

    constructor(app: App, settings: ReadItStackSettings) {
        this.app = app;
        this.settings = settings;
    }

    render(container: HTMLElement, renderedBook: RenderedBook): void {
        const { book, height, displayColor } = renderedBook;
        const displayTitle = book.displayTitle || book.title;

        const spine = container.createDiv({
            cls: `read-it-stack-spine`,
            attr: {
                "data-book-path": book.filePath,
                "aria-label": `${displayTitle} - ${book.pages} pages`
            }
        });

        // Apply dynamic styles
        spine.style.height = `${height}px`;
        spine.style.backgroundColor = displayColor;
        spine.style.color = getContrastTextColor(displayColor);
        spine.style.width = `${this.settings.spineWidth}px`;
        spine.style.borderRadius = `${this.settings.borderRadius}px`;

        // Add gradient overlay for 3D effect
        const gradientOverlay = spine.createDiv({
            cls: "read-it-stack-spine-gradient"
        });

        // Add top edge highlight
        const topEdge = spine.createDiv({
            cls: "read-it-stack-spine-edge-top"
        });
        topEdge.style.backgroundColor = adjustColorBrightness(displayColor, 20);

        // Add bottom edge shadow
        const bottomEdge = spine.createDiv({
            cls: "read-it-stack-spine-edge-bottom"
        });
        bottomEdge.style.backgroundColor = adjustColorBrightness(displayColor, -20);

        // Add title text
        const titleContainer = spine.createDiv({
            cls: "read-it-stack-spine-title-container"
        });

        const titleText = titleContainer.createSpan({
            text: this.truncateTitle(displayTitle, height),
            cls: "read-it-stack-spine-title"
        });

        titleText.style.fontFamily = this.settings.fontFamily;
        titleText.style.fontSize = `${this.settings.fontSize}px`;

        // Add page count if enabled
        if (this.settings.showPageCount && height > 50) {
            spine.createDiv({
                text: `${book.pages}p`,
                cls: "read-it-stack-spine-pages"
            });
        }

        // Add click handler
        spine.addEventListener("click", () => {
            this.openBookNote(book.filePath);
        });

        // Add hover tooltip
        const tooltipLines = [displayTitle];
        if (book.author) tooltipLines.push(`By: ${book.author}`);
        tooltipLines.push(`Pages: ${book.pages}`);
        spine.setAttribute("title", tooltipLines.join("\n"));
    }

    private truncateTitle(title: string, height: number): string {
        const maxChars = Math.floor((this.settings.spineWidth - 24) / (this.settings.fontSize * 0.6));

        if (title.length <= maxChars) return title;

        const truncated = title.substring(0, maxChars - 1);
        const lastSpace = truncated.lastIndexOf(" ");

        if (lastSpace > maxChars * 0.5) {
            return truncated.substring(0, lastSpace) + "...";
        }

        return truncated + "...";
    }

    private openBookNote(filePath: string): void {
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file && file instanceof TFile) {
            this.app.workspace.getLeaf(this.settings.openInNewTab).openFile(file);
        }
    }
}
