import { App } from "obsidian";
import { ReadItStackSettings, BookData, CodeBlockOptions, RenderedBook } from "../types";
import { BookSpineRenderer } from "./BookSpineRenderer";
import { getPastelColor, parseColor } from "../utils/colorUtils";

export class BookStackRenderer {
    private app: App;
    private settings: ReadItStackSettings;
    private container: HTMLElement;
    private spineRenderer: BookSpineRenderer;

    constructor(app: App, settings: ReadItStackSettings, container: HTMLElement) {
        this.app = app;
        this.settings = settings;
        this.container = container;
        this.spineRenderer = new BookSpineRenderer(app, settings);
    }

    render(books: BookData[], options: CodeBlockOptions): void {
        this.container.empty();

        const wrapper = this.container.createDiv({
            cls: "read-it-stack-wrapper"
        });

        if (books.length === 0) {
            this.renderEmptyState(wrapper);
            return;
        }

        const renderedBooks = this.calculateHeights(books);

        const stackContainer = wrapper.createDiv({
            cls: "read-it-stack-container"
        });

        const booksContainer = stackContainer.createDiv({
            cls: "read-it-stack-books"
        });

        // Render books from bottom to top (reverse order for visual stacking)
        for (let i = renderedBooks.length - 1; i >= 0; i--) {
            this.spineRenderer.render(booksContainer, renderedBooks[i]);
        }

        // Add surface/table at bottom
        this.renderSurface(stackContainer);
    }

    private calculateHeights(books: BookData[]): RenderedBook[] {
        const { baseThickness, maxThickness, pxPerPage, spineWidth } = this.settings;

        return books.map((book, index) => {
            // Calculate height: base + (pages × pxPerPage)
            let height = baseThickness + (book.pages * pxPerPage);
            height = Math.min(maxThickness, height);

            // Width is fixed (book length should be consistent)
            const width = spineWidth;

            // Determine color: use book's color if specified, otherwise use pastel palette
            let displayColor: string;
            if (book.color) {
                displayColor = parseColor(book.color);
            } else {
                displayColor = getPastelColor(index);
            }

            return {
                book,
                height,
                width,
                displayColor
            };
        });
    }

    private renderEmptyState(container: HTMLElement): void {
        const emptyState = container.createDiv({
            cls: "read-it-stack-empty"
        });

        emptyState.createSpan({
            text: "No books found matching your criteria.",
            cls: "read-it-stack-empty-text"
        });

        emptyState.createEl("p", {
            text: "Add 'pages' to your book note's frontmatter.",
            cls: "read-it-stack-empty-hint"
        });
    }

    private renderSurface(container: HTMLElement): void {
        container.createDiv({
            cls: "read-it-stack-surface"
        });
    }
}
