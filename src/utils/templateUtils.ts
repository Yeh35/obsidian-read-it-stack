import { BookData } from "../types";

/**
 * 기본 제목 템플릿
 */
export const DEFAULT_TITLE_FORMAT = "{{title}}";

/**
 * 템플릿 문자열에서 변수를 추출하여 BookData 값으로 치환
 * @param template 템플릿 문자열 (예: "{{title}} by {{author}}")
 * @param book BookData 객체
 * @returns 포맷팅된 문자열
 */
export function formatTitle(template: string, book: BookData): string {
    // 공백, 하이픈, 언더스코어를 포함한 변수명 지원
    const variablePattern = /\{\{([\w\s\-]+)\}\}/g;

    return template.replace(variablePattern, (match, variableName: string) => {
        const value = getBookValue(book, variableName.trim());
        return value !== undefined && value !== null ? String(value) : "";
    });
}

/**
 * 변수명 정규화 (공백, 하이픈, 언더스코어 제거 후 소문자)
 */
function normalizeKey(key: string): string {
    return key.toLowerCase().replace(/[\s\-_]/g, "");
}

/**
 * BookData에서 변수명에 해당하는 값 조회
 */
function getBookValue(book: BookData, variableName: string): unknown {
    const normalizedName = normalizeKey(variableName);

    // 예약된 변수명 처리
    switch (normalizedName) {
        case "title":
            return book.title;
        case "filename":
            return book.filename;
        case "path":
            return book.filePath;
        case "author":
            return book.author || "";
        case "pages":
            return book.pages;
        case "status":
            return book.status;
        case "rating":
            return book.rating ?? "";
        case "datefinished":
            return book.dateFinished || "";
        case "tags":
            return book.tags.join(", ");
    }

    // frontmatter에서 추가 필드 조회 (정규화된 키로 매칭)
    if (book.frontmatter) {
        // 원본 키로 먼저 시도
        if (variableName in book.frontmatter) {
            return book.frontmatter[variableName];
        }
        // 정규화된 키로 매칭 시도
        for (const key of Object.keys(book.frontmatter)) {
            if (normalizeKey(key) === normalizedName) {
                return book.frontmatter[key];
            }
        }
    }

    return "";
}
