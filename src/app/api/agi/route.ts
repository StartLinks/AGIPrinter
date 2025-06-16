import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import nodeHtmlToImage from "node-html-to-image";

// 方法1: 使用 dynamic 强制设置为动态路由
export const dynamic = "force-dynamic";

// 方法2: 设置重新验证时间为0，禁用缓存
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        // 从查询参数获取配置
        const searchParams = request.nextUrl.searchParams;
        console.log("Search Params:", searchParams);
        const htmlContent = fs.readFileSync("./template.html", "utf8");

        // 生成图片
        const image = await nodeHtmlToImage({
            html: htmlContent,
            quality: 100,
            type: "png",
            puppeteerArgs: {
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            },
            content: {},
        }) as Buffer;

        // 返回图片
        return new NextResponse(image, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });
    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json(
            { error: "Failed to generate image" },
            { status: 500 },
        );
    }
}
