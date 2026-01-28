import { App, PluginSettingTab, Setting } from "obsidian";
import type ReadItStackPlugin from "./main";
import type { ReadItStackSettings } from "./types";

export const DEFAULT_SETTINGS: ReadItStackSettings = {
    spineWidth: 200,
    minSpineHeight: 30,
    maxSpineHeight: 150,
    pagesPerPixel: 5,
    fontFamily: "Georgia, serif",
    fontSize: 12,
    borderRadius: 8,
    showPageCount: false,
    openInNewTab: false
};

export class ReadItStackSettingTab extends PluginSettingTab {
    plugin: ReadItStackPlugin;

    constructor(app: App, plugin: ReadItStackPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl("h2", { text: "Read-it Stack Settings" });

        // Appearance Section
        containerEl.createEl("h3", { text: "Appearance" });

        new Setting(containerEl)
            .setName("Spine width")
            .setDesc("Width of book spines in pixels")
            .addSlider(slider => slider
                .setLimits(100, 400, 10)
                .setValue(this.plugin.settings.spineWidth)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.spineWidth = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Border radius")
            .setDesc("Roundness of spine corners")
            .addSlider(slider => slider
                .setLimits(0, 20, 1)
                .setValue(this.plugin.settings.borderRadius)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.borderRadius = value;
                    await this.plugin.saveSettings();
                }));

        // Height Calculation Section
        containerEl.createEl("h3", { text: "Height Calculation" });

        new Setting(containerEl)
            .setName("Pages per pixel")
            .setDesc("How many pages equal one pixel of height (lower = taller spines)")
            .addSlider(slider => slider
                .setLimits(1, 20, 1)
                .setValue(this.plugin.settings.pagesPerPixel)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.pagesPerPixel = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Minimum spine height")
            .setDesc("Minimum height for book spines in pixels")
            .addSlider(slider => slider
                .setLimits(20, 100, 5)
                .setValue(this.plugin.settings.minSpineHeight)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.minSpineHeight = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Maximum spine height")
            .setDesc("Maximum height for book spines in pixels")
            .addSlider(slider => slider
                .setLimits(100, 300, 10)
                .setValue(this.plugin.settings.maxSpineHeight)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxSpineHeight = value;
                    await this.plugin.saveSettings();
                }));

        // Typography Section
        containerEl.createEl("h3", { text: "Typography" });

        new Setting(containerEl)
            .setName("Font family")
            .setDesc("Font for book titles on spines")
            .addText(text => text
                .setValue(this.plugin.settings.fontFamily)
                .onChange(async (value) => {
                    this.plugin.settings.fontFamily = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Font size")
            .setDesc("Size of title text in pixels")
            .addSlider(slider => slider
                .setLimits(8, 18, 1)
                .setValue(this.plugin.settings.fontSize)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.fontSize = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Show page count")
            .setDesc("Display page count on book spines")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showPageCount)
                .onChange(async (value) => {
                    this.plugin.settings.showPageCount = value;
                    await this.plugin.saveSettings();
                }));

        // Behavior Section
        containerEl.createEl("h3", { text: "Behavior" });

        new Setting(containerEl)
            .setName("Open in new tab")
            .setDesc("When clicking a book, open the note in a new tab")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.openInNewTab)
                .onChange(async (value) => {
                    this.plugin.settings.openInNewTab = value;
                    await this.plugin.saveSettings();
                }));
    }
}
