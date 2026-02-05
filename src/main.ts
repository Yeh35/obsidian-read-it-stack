import { Plugin, MarkdownPostProcessorContext } from "obsidian";
import { ReadItStackSettings } from "./types";
import { DEFAULT_SETTINGS, ReadItStackSettingTab } from "./settings";
import { BookStackRenderer } from "./renderer/BookStackRenderer";
import { CodeBlockParser } from "./parser/CodeBlockParser";
import { BookDataParser } from "./parser/BookDataParser";

export default class ReadItStackPlugin extends Plugin {
    settings: ReadItStackSettings = DEFAULT_SETTINGS;
    bookDataParser: BookDataParser | null = null;

    async onload(): Promise<void> {
        await this.loadSettings();

        this.bookDataParser = new BookDataParser(this.app, this.settings.spineImageField);

        this.registerMarkdownCodeBlockProcessor(
            "read-it-stack",
            this.processCodeBlock.bind(this)
        );

        this.addSettingTab(new ReadItStackSettingTab(this.app, this));

        this.registerCSSVariables();
    }

    async processCodeBlock(
        source: string,
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext
    ): Promise<void> {
        const codeBlockParser = new CodeBlockParser();
        const options = codeBlockParser.parse(source);

        if (!this.bookDataParser) {
            return;
        }

        const books = this.bookDataParser.getBooks(options);

        const renderer = new BookStackRenderer(this.app, this.settings, el);
        renderer.render(books, options);
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
        this.registerCSSVariables();

        if (this.bookDataParser) {
            this.bookDataParser.setSpineImageField(this.settings.spineImageField);
        }
    }

    registerCSSVariables(): void {
        document.body.style.setProperty(
            "--read-it-stack-spine-width",
            `${this.settings.spineWidth}px`
        );
        document.body.style.setProperty(
            "--read-it-stack-min-height",
            `${this.settings.baseThickness}px`
        );
    }

    onunload(): void {
        // Cleanup
    }
}
