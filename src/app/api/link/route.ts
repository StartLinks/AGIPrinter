import { NextResponse } from "next/server";

export async function GET() {
    try {
        // 从8000端口的服务获取link数据
        const response = await fetch("http://localhost:8000/api/link", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            link: data.link || "",
        });
    } catch (error) {
        console.error("获取 link 失败:", error);
        return NextResponse.json(
            { success: false, error: "获取 link 失败", link: "" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const { link } = await request.json();

        // 将link数据发送到8000端口的服务
        const response = await fetch("http://localhost:8000/link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ link: link || "" }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: "Link 更新成功",
            link: data.link || link || "",
        });
    } catch (error) {
        console.error("更新 link 失败:", error);
        return NextResponse.json(
            { success: false, error: "更新 link 失败" },
            { status: 500 },
        );
    }
}
