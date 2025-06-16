import { NextRequest, NextResponse } from "next/server";
import { generateFontStyles, getAllFonts } from "./lib/fontUtils";
import { createSvgContent, getNoCacheHeaders } from "./lib/svgUtils";

// 方法1: 使用 dynamic 强制设置为动态路由
export const dynamic = "force-dynamic";

// 方法2: 设置重新验证时间为0，禁用缓存
export const revalidate = 0;

export async function GET(_request: NextRequest) {
    try {
        // 获取所有字体
        const fonts = getAllFonts();

        // 生成字体样式
        const fontStyles = generateFontStyles(fonts);

        // 获取当前时间
        const now = new Date();

        // 创建SVG内容
        const svg = createSvgContent({
            width: 794, // A4宽度 210mm @ 96 DPI
            height: 1123, // A4高度 297mm @ 96 DPI
            fontStyles,
            timestamp: now.toLocaleString("zh-CN"),
        });

        return new NextResponse(svg, {
            headers: getNoCacheHeaders(),
        });
    } catch (error) {
        console.error("SVG绘图错误:", error);
        return NextResponse.json(
            { error: "生成SVG失败" },
            { status: 500 },
        );
    }
}
