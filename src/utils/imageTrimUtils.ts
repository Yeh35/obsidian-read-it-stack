/**
 * Image trim utilities for detecting and removing margins from spine images
 */

export interface TrimBounds {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

/**
 * Detect the content bounds of an image by analyzing margins
 * @param img - The image element to analyze
 * @param tolerance - Color difference threshold for margin detection (0-255)
 * @returns TrimBounds object with the content area coordinates
 */
export function detectImageBounds(img: HTMLImageElement, tolerance: number): TrimBounds {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        // Fallback to full image bounds
        return getFullBounds(img);
    }

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    canvas.width = width;
    canvas.height = height;

    try {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // Detect background color from corners
        const bgColor = detectBackgroundColor(pixels, width, height);

        // Find content bounds by scanning from edges
        const top = scanFromTop(pixels, width, height, bgColor, tolerance);
        const bottom = scanFromBottom(pixels, width, height, bgColor, tolerance);
        const left = scanFromLeft(pixels, width, height, bgColor, tolerance);
        const right = scanFromRight(pixels, width, height, bgColor, tolerance);

        // Validate bounds
        if (top >= bottom || left >= right) {
            return getFullBounds(img);
        }

        return {
            top,
            left,
            right,
            bottom,
            width: right - left,
            height: bottom - top
        };
    } catch {
        // CORS or other errors - return full bounds
        return getFullBounds(img);
    }
}

/**
 * Get full image bounds (no trimming)
 */
function getFullBounds(img: HTMLImageElement): TrimBounds {
    return {
        top: 0,
        left: 0,
        right: img.naturalWidth,
        bottom: img.naturalHeight,
        width: img.naturalWidth,
        height: img.naturalHeight
    };
}

/**
 * Detect background color by sampling corner pixels
 */
function detectBackgroundColor(pixels: Uint8ClampedArray, width: number, height: number): RGB {
    const corners = [
        getPixelAt(pixels, 0, 0, width),                    // top-left
        getPixelAt(pixels, width - 1, 0, width),            // top-right
        getPixelAt(pixels, 0, height - 1, width),           // bottom-left
        getPixelAt(pixels, width - 1, height - 1, width)    // bottom-right
    ];

    // Use the most common corner color (simple majority)
    const colorCounts = new Map<string, { count: number; color: RGB }>();

    for (const color of corners) {
        const key = `${color.r},${color.g},${color.b}`;
        const existing = colorCounts.get(key);
        if (existing) {
            existing.count++;
        } else {
            colorCounts.set(key, { count: 1, color });
        }
    }

    let maxCount = 0;
    let bgColor: RGB = corners[0];

    for (const { count, color } of colorCounts.values()) {
        if (count > maxCount) {
            maxCount = count;
            bgColor = color;
        }
    }

    return bgColor;
}

/**
 * Get pixel RGB at coordinates
 */
function getPixelAt(pixels: Uint8ClampedArray, x: number, y: number, width: number): RGB {
    const idx = (y * width + x) * 4;
    return {
        r: pixels[idx],
        g: pixels[idx + 1],
        b: pixels[idx + 2]
    };
}

/**
 * Get pixel alpha at coordinates
 */
function getAlphaAt(pixels: Uint8ClampedArray, x: number, y: number, width: number): number {
    const idx = (y * width + x) * 4;
    return pixels[idx + 3];
}

/**
 * Check if a pixel is content (not background)
 */
function isContentPixel(
    pixels: Uint8ClampedArray,
    x: number,
    y: number,
    width: number,
    bgColor: RGB,
    tolerance: number
): boolean {
    const alpha = getAlphaAt(pixels, x, y, width);

    // Transparent pixels are margin
    if (alpha < 10) return false;

    const pixel = getPixelAt(pixels, x, y, width);
    const diff = Math.abs(pixel.r - bgColor.r) +
                 Math.abs(pixel.g - bgColor.g) +
                 Math.abs(pixel.b - bgColor.b);

    return diff > tolerance;
}

/**
 * Scan from top to find first content row
 */
function scanFromTop(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    bgColor: RGB,
    tolerance: number
): number {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (isContentPixel(pixels, x, y, width, bgColor, tolerance)) {
                return y;
            }
        }
    }
    return 0;
}

/**
 * Scan from bottom to find last content row
 */
function scanFromBottom(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    bgColor: RGB,
    tolerance: number
): number {
    for (let y = height - 1; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
            if (isContentPixel(pixels, x, y, width, bgColor, tolerance)) {
                return y + 1;
            }
        }
    }
    return height;
}

/**
 * Scan from left to find first content column
 */
function scanFromLeft(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    bgColor: RGB,
    tolerance: number
): number {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (isContentPixel(pixels, x, y, width, bgColor, tolerance)) {
                return x;
            }
        }
    }
    return 0;
}

/**
 * Scan from right to find last content column
 */
function scanFromRight(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    bgColor: RGB,
    tolerance: number
): number {
    for (let x = width - 1; x >= 0; x--) {
        for (let y = 0; y < height; y++) {
            if (isContentPixel(pixels, x, y, width, bgColor, tolerance)) {
                return x + 1;
            }
        }
    }
    return width;
}

/**
 * Create a cropped image Data URL from the detected bounds
 * @param img - The source image element
 * @param bounds - The content bounds to crop to
 * @returns Data URL of the cropped image
 */
export function createCroppedImageDataUrl(img: HTMLImageElement, bounds: TrimBounds): string | null {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return null;
    }

    canvas.width = bounds.width;
    canvas.height = bounds.height;

    try {
        ctx.drawImage(
            img,
            bounds.left, bounds.top,      // Source position
            bounds.width, bounds.height,  // Source size
            0, 0,                         // Destination position
            bounds.width, bounds.height   // Destination size
        );

        return canvas.toDataURL("image/png");
    } catch {
        // CORS or other errors
        return null;
    }
}
