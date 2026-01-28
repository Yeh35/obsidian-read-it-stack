import { CodeBlockOptions, BookStatus, SortOption } from "../types";

export class CodeBlockParser {
    parse(source: string): CodeBlockOptions {
        const options: CodeBlockOptions = {
            sortBy: "title",
            sortOrder: "asc"
        };

        const lines = source.trim().split("\n");

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;

            const colonIndex = trimmed.indexOf(":");
            if (colonIndex === -1) continue;

            const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
            const value = trimmed.substring(colonIndex + 1).trim();

            switch (key) {
                case "folder":
                    options.folder = value;
                    break;
                case "tag":
                    options.tag = value.startsWith("#") ? value : `#${value}`;
                    break;
                case "status":
                    options.status = this.parseStatusList(value);
                    break;
                case "sort":
                case "sortby":
                    options.sortBy = value as SortOption;
                    break;
                case "order":
                case "sortorder":
                    options.sortOrder = value === "desc" ? "desc" : "asc";
                    break;
                case "limit":
                    options.limit = parseInt(value, 10);
                    break;
                case "titleformat":
                case "title-format":
                case "title_format":
                    options.titleFormat = value;
                    break;
            }
        }

        return options;
    }

    private parseStatusList(value: string): BookStatus[] {
        return value
            .split(",")
            .map(s => s.trim().toLowerCase() as BookStatus)
            .filter(s => ["reading", "done", "to-read", "abandoned"].includes(s));
    }
}
