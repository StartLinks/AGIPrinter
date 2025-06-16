import fs from "fs";
import path from "path";

/**
 * 读取字体文件并转换为base64
 * @param fontPath 字体文件路径
 * @returns base64编码的字体数据
 */
export function getFontBase64(fontPath: string): string {
    try {
        const fontBuffer = fs.readFileSync(fontPath);
        return fontBuffer.toString("base64");
    } catch (error) {
        console.error("读取字体文件失败:", error);
        return "";
    }
}

/**
 * 获取所有字体的base64数据
 * @returns 包含所有字体base64数据的对象
 */
export function getAllFonts() {
    const fonts = {
        ChiKareGo: getFontBase64(
            path.join(process.cwd(), "public", "ChiKareGo.ttf"),
        ),
        FindersKeepers: getFontBase64(
            path.join(process.cwd(), "public", "FindersKeepers.ttf"),
        ),
        FusionPixel: getFontBase64(
            path.join(
                process.cwd(),
                "public",
                "fusion-pixel-12px-proportional-zh_hans.ttf",
            ),
        ),
    };
    return fonts;
}

/**
 * 生成字体样式定义
 * @param fonts 字体base64数据对象
 * @returns SVG字体样式定义字符串
 */
export function generateFontStyles(fonts: Record<string, string>): string {
    const styles = [];

    if (fonts.ChiKareGo) {
        styles.push(`
            @font-face {
                font-family: 'ChiKareGo';
                src: url(data:application/font-truetype;charset=utf-8;base64,${fonts.ChiKareGo}) format('truetype');
            }`);
    }

    if (fonts.FindersKeepers) {
        styles.push(`
            @font-face {
                font-family: 'FindersKeepers';
                src: url(data:application/font-truetype;charset=utf-8;base64,${fonts.FindersKeepers}) format('truetype');
            }`);
    }

    if (fonts.FusionPixel) {
        styles.push(`
            @font-face {
                font-family: 'FusionPixel';
                src: url(data:application/font-truetype;charset=utf-8;base64,${fonts.FusionPixel}) format('truetype');
            }`);
    }

    return styles.length > 0
        ? `<defs><style>${styles.join("")}</style></defs>`
        : "";
}
