import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

// 强制动态路由和禁用缓存，保持风格一致
export const dynamic = "force-dynamic";
export const revalidate = 0;

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    // Save the image to ~/Downloads as PNG if present
    let fileSaved = false;
    let filePath = "";
    if (
      imageBase64 &&
      typeof imageBase64 === "string" &&
      imageBase64.startsWith("data:image/png;base64,")
    ) {
      const base64Data = imageBase64.replace(/^data:image\/png;base64,/, "");
      // Use the user's home directory for Downloads
      const downloadDir = path.join(
        process.env.HOME || process.env.USERPROFILE || "",
        "Downloads",
      );
      filePath = path.join(downloadDir, `print_area_${Date.now()}.png`);
      fs.writeFileSync(filePath, base64Data, "base64");
      fileSaved = true;
    }

    // 固定测试命令
    const command = `lp "${filePath}"`;
    const { stdout, stderr } = await execAsync(command);

    return NextResponse.json(
      {
        stdout: stdout ?? "",
        stderr: stderr ?? "",
        fileSaved,
        filePath,
      },
      { status: 200 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Command execution failed",
        stderr: error.stderr ?? "",
      },
      { status: 500 },
    );
  }
}

// 非POST请求返回405
export async function GET() {
  return new NextResponse(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { Allow: "POST", "Content-Type": "application/json" },
  });
}
