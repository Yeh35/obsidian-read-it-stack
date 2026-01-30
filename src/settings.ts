import { App, PluginSettingTab, Setting } from "obsidian";
import type ReadItStackPlugin from "./main";
import type { ReadItStackSettings } from "./types";
import { getAvailableFonts, isCustomFont } from "./utils/fontUtils";

export const DEFAULT_SETTINGS: ReadItStackSettings = {
    spineWidth: 200,
    baseThickness: 15,
    maxThickness: 80,
    pxPerPage: 0.1,
    fontFamily: "'11StreetGothic', sans-serif",
    fontSize: 12,
    borderRadius: 8,
    showPageCount: false,
    openInNewTab: false,
    spineImageField: "spine",
    enableImageTrim: false,
    trimTolerance: 30
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

        new Setting(containerEl)
            .setName("Spine image field")
            .setDesc("Frontmatter field name for custom spine images (e.g., 'spine', 'spine_image', 'book_spine')")
            .addText(text => text
                .setPlaceholder("spine")
                .setValue(this.plugin.settings.spineImageField)
                .onChange(async (value) => {
                    this.plugin.settings.spineImageField = value || "spine";
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Auto-trim spine images")
            .setDesc("Automatically detect and remove margins from spine images")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableImageTrim)
                .onChange(async (value) => {
                    this.plugin.settings.enableImageTrim = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Trim tolerance")
            .setDesc("Color difference threshold for margin detection (0-100)")
            .addSlider(slider => slider
                .setLimits(0, 100, 5)
                .setValue(this.plugin.settings.trimTolerance)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.trimTolerance = value;
                    await this.plugin.saveSettings();
                }));

        // Thickness Calculation Section
        containerEl.createEl("h3", { text: "Thickness Calculation" });

        new Setting(containerEl)
            .setName("Base thickness")
            .setDesc("Base thickness for all books in pixels")
            .addSlider(slider => slider
                .setLimits(10, 30, 1)
                .setValue(this.plugin.settings.baseThickness)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.baseThickness = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Pixels per page")
            .setDesc("Additional pixels per page (e.g., 0.1 = 300 pages adds 30px)")
            .addSlider(slider => slider
                .setLimits(0.05, 0.3, 0.01)
                .setValue(this.plugin.settings.pxPerPage)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.pxPerPage = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Maximum thickness")
            .setDesc("Maximum thickness for books in pixels")
            .addSlider(slider => slider
                .setLimits(50, 300, 5)
                .setValue(this.plugin.settings.maxThickness)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxThickness = value;
                    await this.plugin.saveSettings();
                }));

        // Typography Section
        containerEl.createEl("h3", { text: "Typography" });

        const availableFonts = getAvailableFonts();
        const currentFont = this.plugin.settings.fontFamily;
        const isCustom = isCustomFont(currentFont);

        new Setting(containerEl)
            .setName("Font family")
            .setDesc("Font for book titles on spines")
            .addDropdown(dropdown => {
                availableFonts.forEach(font => {
                    dropdown.addOption(font.value, font.name);
                });
                dropdown.addOption("__custom__", "Custom...");

                dropdown.setValue(isCustom ? "__custom__" : currentFont);
                dropdown.onChange(async (value) => {
                    if (value === "__custom__") {
                        customFontSetting.settingEl.show();
                    } else {
                        customFontSetting.settingEl.hide();
                        this.plugin.settings.fontFamily = value;
                        await this.plugin.saveSettings();
                    }
                });
            });

        const customFontSetting = new Setting(containerEl)
            .setName("Custom font")
            .setDesc("Enter a custom font family (e.g., 'Nanum Myeongjo', serif)")
            .addText(text => text
                .setPlaceholder("'Font Name', fallback")
                .setValue(isCustom ? currentFont : "")
                .onChange(async (value) => {
                    if (value.trim()) {
                        this.plugin.settings.fontFamily = value;
                        await this.plugin.saveSettings();
                    }
                }));

        if (!isCustom) {
            customFontSetting.settingEl.hide();
        }

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
