// Book data extracted from frontmatter
export interface BookData {
    title: string;
    displayTitle?: string;
    filename: string;
    pages: number;
    color: string | null;
    status: BookStatus;
    filePath: string;
    tags: string[];
    author?: string;
    rating?: number;
    dateFinished?: string;
    frontmatter?: Record<string, unknown>;
}

// Possible book reading statuses
export type BookStatus = "reading" | "done" | "to-read" | "abandoned";

// Options parsed from code block
export interface CodeBlockOptions {
    folder?: string;
    tag?: string;
    status?: BookStatus[];
    sortBy?: SortOption;
    sortOrder?: "asc" | "desc";
    limit?: number;
    titleFormat?: string;
}

export type SortOption = "title" | "pages" | "dateFinished" | "rating";

// Rendered book for display
export interface RenderedBook {
    book: BookData;
    height: number;
    displayColor: string;
}

// Plugin settings
export interface ReadItStackSettings {
    spineWidth: number;
    minSpineHeight: number;
    maxSpineHeight: number;
    pagesPerPixel: number;
    fontFamily: string;
    fontSize: number;
    borderRadius: number;
    showPageCount: boolean;
    openInNewTab: boolean;
}
