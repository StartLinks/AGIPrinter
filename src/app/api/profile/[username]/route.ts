import { NextRequest, NextResponse } from "next/server";

// 设置为动态路由
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
    request: NextRequest,
    { params }: { params: { username: string } },
) {
    try {
        const { username } = params;

        if (!username) {
            return NextResponse.json(
                { error: "用户名不能为空" },
                { status: 400 },
            );
        }

        // 调用外部API
        const externalApiUrl =
            `https://fc-mp-b1a9bc8c-0aab-44ca-9af2-2bd604163a78.next.bspapp.com/profile/${username}`;

        const response = await fetch(externalApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "AGIPrinter/1.0",
            },
            // 设置超时时间
            signal: AbortSignal.timeout(10000), // 10秒超时
        });

        if (!response.ok) {
            // 根据状态码返回相应错误
            if (response.status === 404) {
                return NextResponse.json(
                    { error: "用户不存在", success: false },
                    { status: 404 },
                );
            } else if (response.status >= 500) {
                return NextResponse.json(
                    { error: "外部服务器错误，请稍后重试", success: false },
                    { status: 502 },
                );
            } else if (response.status === 429) {
                return NextResponse.json(
                    { error: "请求过于频繁，请稍后重试", success: false },
                    { status: 429 },
                );
            } else {
                return NextResponse.json(
                    { error: `请求失败: ${response.status}`, success: false },
                    { status: response.status },
                );
            }
        }

        const data = await response.json();

        // 返回数据，保持原有的数据结构
        return NextResponse.json(data, {
            status: 200,
            headers: {
                "Cache-Control":
                    "public, max-age=300, stale-while-revalidate=60", // 缓存5分钟
            },
        });
    } catch (error) {
        console.error("代理API错误:", error);

        // 处理不同类型的错误
        if (error instanceof Error) {
            if (error.name === "AbortError") {
                return NextResponse.json(
                    { error: "请求超时，请稍后重试", success: false },
                    { status: 408 },
                );
            } else if (error.message.includes("fetch")) {
                return NextResponse.json(
                    { error: "网络连接失败，请检查网络连接", success: false },
                    { status: 503 },
                );
            }
        }

        return NextResponse.json(
            { error: "服务器内部错误", success: false },
            { status: 500 },
        );
    }
}
