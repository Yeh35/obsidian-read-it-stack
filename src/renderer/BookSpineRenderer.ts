import { App, TFile } from "obsidian";
import { ReadItStackSettings, RenderedBook } from "../types";
import { adjustColorBrightness, getContrastTextColor } from "../utils/colorUtils";
import { detectImageBounds, createCroppedImageDataUrl } from "../utils/imageTrimUtils";

export class BookSpineRenderer {
    private app: App;
    private settings: ReadItStackSettings;

    constructor(app: App, settings: ReadItStackSettings) {
        this.app = app;
        this.settings = settings;
    }

    render(container: HTMLElement, renderedBook: RenderedBook): void {
        const { book, height, width, displayColor } = renderedBook;
        const displayTitle = book.displayTitle || book.title;
        const hasSpineImage = !!book.spineImage;

        const spine = container.createDiv({
            cls: `read-it-stack-spine${hasSpineImage ? " read-it-stack-spine-image" : ""}`,
            attr: {
                "data-book-path": book.filePath,
                "aria-label": `${displayTitle} - ${book.pages} pages`
            }
        });

        // Apply dynamic styles
        spine.style.height = `${height}px`;
        spine.style.width = `${width}px`;
        spine.style.borderRadius = `${this.settings.borderRadius}px`;

        if (hasSpineImage && book.spineImage) {
            // Image-based rendering
            spine.style.backgroundColor = displayColor; // Fallback color

            // Create image container - fills the entire spine
            const imgContainer = spine.createDiv({
                cls: "read-it-stack-spine-img-container"
            });

            // Create image element
            const img = imgContainer.createEl("img", {
                cls: "read-it-stack-spine-img",
                attr: {
                    src: book.spineImage,
                    alt: displayTitle
                }
            });

            // 이미지 비율 유지, 최대 크기 제한
            img.onload = () => {
                let contentWidth = img.naturalWidth;
                let contentHeight = img.naturalHeight;

                // Apply image trimming if enabled
                if (this.settings.enableImageTrim) {
                    const bounds = detectImageBounds(img, this.settings.trimTolerance);

                    // Only crop if bounds differ from original
                    if (bounds.width < img.naturalWidth || bounds.height < img.naturalHeight) {
                        const croppedDataUrl = createCroppedImageDataUrl(img, bounds);
                        if (croppedDataUrl) {
                            // Replace image source with cropped version
                            img.src = croppedDataUrl;
                            contentWidth = bounds.width;
                            contentHeight = bounds.height;
                        }
                    }
                }

                const aspectRatio = contentWidth / contentHeight;
                const maxWidth = width;
                const maxHeight = this.settings.maxThickness;

                let finalWidth = maxWidth;
                let finalHeight = finalWidth / aspectRatio;

                // 높이가 최대값 초과시 높이 기준으로 재계산
                if (finalHeight > maxHeight) {
                    finalHeight = maxHeight;
                    finalWidth = finalHeight * aspectRatio;
                }

                spine.style.width = `${Math.round(finalWidth)}px`;
                spine.style.height = `${Math.round(finalHeight)}px`;
            };
        } else {
            // Color-based rendering
            spine.style.backgroundColor = displayColor;
            spine.style.color = getContrastTextColor(displayColor);

            // Add gradient overlay for 3D effect
            spine.createDiv({
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
        }

        // Add title text (only if no spine image)
        if (!hasSpineImage) {
            const titleContainer = spine.createDiv({
                cls: "read-it-stack-spine-title-container"
            });

            const titleText = titleContainer.createSpan({
                text: this.truncateTitle(displayTitle, width),
                cls: "read-it-stack-spine-title"
            });

            titleText.style.fontFamily = this.settings.fontFamily;
            titleText.style.fontSize = `${this.settings.fontSize}px`;
        }

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

    private truncateTitle(title: string, width: number): string {
        const maxChars = Math.floor((width - 24) / (this.settings.fontSize * 0.6));

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
