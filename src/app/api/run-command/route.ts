import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

// 强制动态路由和禁用缓存，保持风格一致
export const dynamic = "force-dynamic";
export const revalidate = 0;

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();

    // 固定测试命令
    const command = `lp "${filePath}"`;
    const { stdout, stderr } = await execAsync(command);

    return NextResponse.json(
      {
        stdout: stdout ?? "",
        stderr: stderr ?? "",
        filePath,
        message: "Command executed successfully",
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
