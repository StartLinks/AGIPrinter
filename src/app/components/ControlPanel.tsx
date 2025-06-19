"use client";

import Image from "next/image";
import { useState } from "react";
import NoStyleInput from "./NoStyleInput";
import html2canvas from "html2canvas-pro";

interface ControlPanelProps {
  username: string;
  onUsernameChange: (value: string) => void;
  debouncedUsername: string;
  isLoading: boolean;
  error: Error | null;
  notes: Array<{
    id: string;
    text: string;
    position: { x: number; y: number };
  }>;
  onAddNote: () => void;
  onRemoveNote: () => void;
  onPrint: () => void;
}

export default function ControlPanel({
  username,
  onUsernameChange,
  debouncedUsername,
  isLoading,
  error,
  notes,
  onAddNote,
  onRemoveNote,
  onPrint,
}: ControlPanelProps) {
  // 显示URL提取提示的状态
  const [showUrlExtractedTip, setShowUrlExtractedTip] = useState(false);

  // 新增：API调用相关状态
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiImageBase64, setApiImageBase64] = useState<string | null>(null);

  // 调用API的函数
  const handleCallApi = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiResult(null);
    setApiImageBase64(null);
    try {
      // 获取 print-area 的 base64 图片
      const printContent = document.getElementById("print-area");
      let imageBase64 = "";
      if (printContent) {
        // Remove animation and transition styles/classes recursively before capture
        function removeAnimations(element: HTMLElement) {
          element.style.animation = "none";
          element.style.transition = "none";
          element.classList.forEach((cls) => {
            if (cls.startsWith("animate-")) element.classList.remove(cls);
          });
          Array.from(element.children).forEach((child) =>
            removeAnimations(child as HTMLElement),
          );
        }
        removeAnimations(printContent);

        // Collect all CSS rules
        const styles = Array.from(document.styleSheets)
          .map((styleSheet) => {
            try {
              return Array.from(styleSheet.cssRules)
                .map((rule) => rule.cssText)
                .join("");
            } catch (e) {
              return "";
            }
          })
          .join("");

        // Create a hidden iframe
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        // iframe.style.visibility = "hidden";
        iframe.style.width = printContent.offsetWidth + "px";
        iframe.style.height = printContent.offsetHeight + "px";
        document.body.appendChild(iframe);

        // Write full HTML into the iframe
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <style>${styles}</style>
              </head>
              <body style="margin:0;padding:0;">
                ${printContent.outerHTML}
              </body>
            </html>
          `);
          doc.close();
        }

        // Wait for iframe to load
        await new Promise((resolve) => setTimeout(resolve, 500));
        const iframePrintContent = doc?.getElementById("print-area");

        // Add a short delay to ensure rendering is complete
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Capture with html2canvas-pro on the iframe's print-area
        if (iframePrintContent) {
          const canvas = await html2canvas(iframePrintContent as HTMLElement, {
            useCORS: true,
            backgroundColor: null,
          });
          imageBase64 = canvas.toDataURL("image/png");
          setApiImageBase64(imageBase64);
        }

        // Clean up: remove the iframe
        document.body.removeChild(iframe);
      }

      // 发送 base64 到 API
      const res = await fetch("/api/run-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await res.json();
      if (res.ok) {
        setApiResult(data.stdout || "(无输出)");
      } else {
        setApiError(data.error || "API调用失败");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setApiError(error.message || "网络错误");
      setApiImageBase64(null);
    } finally {
      setApiLoading(false);
    }
  };

  // 处理用户名变化，支持自动截取完整URL
  const handleUsernameChange = (value: string) => {
    // 支持多种格式的bonjour.bio链接
    const bonjourUrlPatterns = [
      /^https?:\/\/bonjour\.bio\/([a-zA-Z0-9_-]+)$/, // 标准格式
      /^https?:\/\/www\.bonjour\.bio\/([a-zA-Z0-9_-]+)$/, // 带www
      /^bonjour\.bio\/([a-zA-Z0-9_-]+)$/, // 不带协议
      /^www\.bonjour\.bio\/([a-zA-Z0-9_-]+)$/, // 不带协议但有www
    ];

    let extractedUsername = null;

    // 尝试匹配各种格式
    for (const pattern of bonjourUrlPatterns) {
      const match = value.trim().match(pattern);
      if (match) {
        extractedUsername = match[1];
        break;
      }
    }

    if (extractedUsername) {
      // 如果是完整链接，提取用户名部分
      onUsernameChange(extractedUsername);
      console.log("从完整链接中提取用户名:", extractedUsername);

      // 显示提取成功提示
      setShowUrlExtractedTip(true);
      setTimeout(() => setShowUrlExtractedTip(false), 3000);
    } else {
      // 否则直接使用输入值
      onUsernameChange(value);
      console.log("Profile Link changed:", value);
    }
  };
  return (
    <div className="flex h-fit flex-col border-2 border-dashed divide-y-1 divide-black bg-gray-50 font-fusion-pixel">
      {/* 专属链接区域 */}
      <div className="flex flex-col gap-2 py-3 px-4 w-100">
        <div className="font-semibold">专属链接</div>
        <div className="text-sm opacity-50 flex items-center flex-wrap">
          扫描小程序码，复制专属链接
          {isLoading && <span className="ml-2 text-blue-600">加载中...</span>}
          {error && (
            <span className="ml-2 text-red-600">
              {error.message.includes("404") ? "用户不存在" : "网络错误"}
            </span>
          )}
        </div>
        <div className="flex items-center">
          https://bonjour.bio/
          <NoStyleInput
            aria-label="Profile Link"
            value={username}
            className="border-b border-black px-2 py-1 w-20!"
            onChange={(value) => {
              handleUsernameChange(value);
            }}
            placeholder="rabithua"
          />
        </div>
        {debouncedUsername !== username && (
          <div className="text-xs text-gray-500">正在等待输入完成...</div>
        )}

        {/* URL提取成功提示 */}
        {showUrlExtractedTip && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            ✅ 已自动提取用户名
          </div>
        )}

        {/* 状态指示器 */}
        {debouncedUsername && (
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${isLoading
                ? "bg-blue-500 animate-pulse"
                : error
                  ? "bg-red-500"
                  : "bg-green-500"
                }`}
            />
            <span
              className={
                isLoading
                  ? "text-blue-600"
                  : error
                    ? "text-red-600"
                    : "text-green-600"
              }
            >
              {isLoading
                ? "正在加载用户数据..."
                : error
                  ? "用户数据加载失败"
                  : "用户数据加载成功"}
            </span>
          </div>
        )}
      </div>

      {/* 便签管理区域 */}
      <div className="flex flex-col gap-3 py-3 px-4">
        <div className="font-semibold">便签管理</div>
        <div className="text-sm opacity-50">
          便签点击可以输入内容，拖拽调整位置或输入框高度
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddNote}
            className="px-3 py-1 bg-blue-500 text-white text-sm border border-black hover:bg-blue-600 transition-colors"
          >
            添加便签
          </button>
          <button
            onClick={onRemoveNote}
            disabled={notes.length === 0}
            className="px-3 py-1 bg-red-500 text-white text-sm border border-black hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            删除便签
          </button>
        </div>
        <div className="text-xs text-gray-600">
          当前便签数量: {notes.length}
        </div>
      </div>

      {/* 打印功能区域 */}
      <div className="flex flex-col gap-3 py-3 px-4">
        <div className="font-semibold">打印功能</div>
        <button
          onClick={onPrint}
          className="px-4 py-2 bg-green-500 text-white text-sm border border-black hover:bg-green-600 transition-colors font-medium"
        >
          🖨️ 打印右侧内容
        </button>
        <div className="text-xs text-gray-600">点击按钮打印右侧卡片内容</div>
        {/* 新增：调用API按钮和结果显示 */}
        <button
          onClick={handleCallApi}
          className="px-4 py-2 bg-purple-500 text-white text-sm border border-black hover:bg-purple-600 transition-colors font-medium"
          disabled={apiLoading}
          style={{ marginTop: "8px" }}
        >
          {apiLoading ? "正在调用API..." : "调用打印API (测试)"}
        </button>
        {apiResult && (
          <div className="text-xs text-green-700 bg-green-50 border border-green-300 rounded px-2 py-1 mt-1 break-words overflow-hidden max-w-sm">
            API输出: {apiResult}
          </div>
        )}

        {apiError && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-300 rounded px-2 py-1 mt-1 break-words overflow-hidden max-w-sm">
            API错误: {apiError}
          </div>
        )}
      </div>

      {/* 二维码 */}
      <Image
        src="/qrcode.png"
        alt="Logo"
        width={100}
        height={100}
        className="size-48 my-5 mx-auto border-2 p-3 bg-white rounded-3xl"
        style={{ boxShadow: "0 0 25px rgba(255, 255, 255, 0.8)" }}
      />
    </div>
  );
}
