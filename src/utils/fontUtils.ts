export interface FontOption {
    name: string;
    value: string;
}

// Web fonts bundled with the plugin (always available)
export const BUNDLED_FONTS: FontOption[] = [
    { name: "11번가 고딕", value: "'11StreetGothic', sans-serif" },
];

export const PRESET_FONTS: FontOption[] = [
    // Web safe fonts
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Times New Roman", value: "'Times New Roman', serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { name: "Courier New", value: "'Courier New', monospace" },
    // macOS fonts
    { name: "San Francisco", value: "-apple-system, BlinkMacSystemFont, sans-serif" },
    { name: "Helvetica Neue", value: "'Helvetica Neue', sans-serif" },
    // Windows fonts
    { name: "Segoe UI", value: "'Segoe UI', sans-serif" },
    { name: "Malgun Gothic", value: "'Malgun Gothic', sans-serif" },
    // Korean fonts
    { name: "Apple SD Gothic Neo", value: "'Apple SD Gothic Neo', sans-serif" },
    { name: "Nanum Gothic", value: "'Nanum Gothic', sans-serif" },
    { name: "Nanum Myeongjo", value: "'Nanum Myeongjo', serif" },
    { name: "Noto Sans KR", value: "'Noto Sans KR', sans-serif" },
];

export function getAvailableFonts(): FontOption[] {
    if (typeof document === "undefined" || !document.fonts || typeof document.fonts.check !== "function") {
        return [...BUNDLED_FONTS, ...PRESET_FONTS];
    }

    const availableSystemFonts = PRESET_FONTS.filter(font => {
        try {
            const primaryFont = font.value.split(",")[0].trim().replace(/['"]/g, "");
            return document.fonts.check(`12px "${primaryFont}"`);
        } catch {
            return true;
        }
    });

    return [...BUNDLED_FONTS, ...availableSystemFonts];
}

export function isCustomFont(fontValue: string): boolean {
    const allFonts = [...BUNDLED_FONTS, ...PRESET_FONTS];
    return !allFonts.some(font => font.value === fontValue);
}
