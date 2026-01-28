// Pastel color palette (matching the reference image)
export const PASTEL_COLORS = [
    "#E8B4B8", // 연한 핑크
    "#EAD1DC", // 연분홍
    "#F5DEB3", // 밀색
    "#D4E6D7", // 연한 민트
    "#C5D8E8", // 연한 하늘
    "#D8C5E8", // 연한 보라
];

/**
 * Get a pastel color based on index (cycles through palette)
 */
export function getPastelColor(index: number): string {
    return PASTEL_COLORS[index % PASTEL_COLORS.length];
}

/**
 * Adjust color brightness
 */
export function adjustColorBrightness(hex: string, percent: number): string {
    hex = hex.replace(/^#/, "");

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.min(255, Math.max(0, r + (r * percent / 100)));
    g = Math.min(255, Math.max(0, g + (g * percent / 100)));
    b = Math.min(255, Math.max(0, b + (b * percent / 100)));

    return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

/**
 * Get contrasting text color (black or white) for a background
 */
export function getContrastTextColor(hex: string): string {
    hex = hex.replace(/^#/, "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#333333" : "#f5f5f5";
}

/**
 * Parse color from various formats (hex or named colors)
 */
export function parseColor(color: string): string {
    if (color.startsWith("#")) return color;

    const namedColors: Record<string, string> = {
        red: "#F44336",
        blue: "#2196F3",
        green: "#4CAF50",
        yellow: "#FFEB3B",
        orange: "#FF9800",
        purple: "#9C27B0",
        pink: "#E91E63",
        brown: "#795548",
        gray: "#9E9E9E",
        grey: "#9E9E9E",
        black: "#212121",
        white: "#FAFAFA",
        gold: "#FFD700",
        navy: "#001f3f",
        teal: "#009688",
        maroon: "#800000"
    };

    return namedColors[color.toLowerCase()] || color;
}
