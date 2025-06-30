"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import NoStyleInput from "./NoStyleInput";
import { useLinkPolling } from "../hooks/useLinkPolling";
import { snapdom } from "@zumer/snapdom";

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

  // 自动打印开关状态
  const [autoPrintEnabled, setAutoPrintEnabled] = useState(false);

  // 新增：API调用相关状态
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [_apiImageBase64, setApiImageBase64] = useState<string | null>(null);


  // 处理 link 变化的函数
  const handleLink = (link: string) => {
    if (!link) {
      // 清空状态
      document.body.classList.remove("is-loading");
      document.body.classList.remove("has-profile");
      const qrCodeCanvas = document.getElementById("qrCodeCanvas");
      if (qrCodeCanvas) {
        qrCodeCanvas.innerHTML = "";
      }
      return;
    }

    // 设置加载状态
    document.body.classList.add("is-loading");

    // 处理新的 link
    console.log('处理新的 link:', link);

    // 这里可以根据 link 的内容来决定是获取用户资料还是其他操作
    // 如果是用户名，可以更新 username 状态
    if (link.startsWith('http') || link.startsWith('https')) {
      // 如果是完整的 URL，可能需要解析出用户名或其他信息
      console.log('处理 URL:', link);
    } else {
      // 如果是用户名，直接设置
      onUsernameChange(link);
    }

    // 移除加载状态并添加有资料状态
    setTimeout(() => {
      document.body.classList.remove("is-loading");
      document.body.classList.add("has-profile");
    }, 1000);
  };

  // 监听用户名变化并在数据加载完成后自动打印
  useEffect(() => {
    // 只有在开启自动打印、不是加载状态、没有错误、且用户名存在时才自动打印
    if (autoPrintEnabled && !isLoading && !error && debouncedUsername && debouncedUsername !== '') {
      // 延迟一点时间确保页面完全渲染
      const timer = setTimeout(() => {
        console.log('数据加载完成，自动触发打印...');
        handleCallApi();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoPrintEnabled, isLoading, error, debouncedUsername]); // 监听这些状态的变化

  // Link 轮询
  const { startPolling, stopPolling } = useLinkPolling({
    interval: 2000, // 每2秒轮询一次
    onLinkChange: handleLink,
    onError: (error) => {
      console.error("Link polling error:", error);
      document.body.classList.remove("is-loading");
      document.body.classList.remove("has-profile");
      const qrCodeCanvas = document.getElementById("qrCodeCanvas");
      if (qrCodeCanvas) {
        qrCodeCanvas.innerHTML = "";
      }
    }
  });

  // 组件挂载时开始轮询
  useEffect(() => {
    startPolling();

    // 组件卸载时停止轮询
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  // 调用API的函数
  const handleCallApi = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiResult(null);
    setApiImageBase64(null);
    try {
      // 获取 print-area 的 base64 图片
      const printContent = document.getElementById("print-area");
      if (!printContent) {
        setApiError("未找到打印区域");
        setApiLoading(false);
        return;
      }
      let result;
      try {
        result = await snapdom(printContent, { scale: 2 });
      } catch (e) {
        const msg = (e && typeof e === 'object' && 'message' in e) ? (e as { message: string }).message : String(e);
        setApiError("截图失败: " + msg);
        setApiLoading(false);
        return;
      }
      let imageBase64 = "";
      try {
        // snapdom 的 toPng() 返回 HTMLImageElement，需要转为 base64
        const imgElem = await result.toPng();
        // 创建 canvas 并绘制图片
        const canvas = document.createElement('canvas');
        canvas.width = imgElem.width;
        canvas.height = imgElem.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(imgElem, 0, 0);
          imageBase64 = canvas.toDataURL('image/png');
        } else {
          setApiError("无法获取 canvas 上下文");
          setApiLoading(false);
          return;
        }
      } catch (e) {
        const msg = (e && typeof e === 'object' && 'message' in e) ? (e as { message: string }).message : String(e);
        setApiError("图片转码失败: " + msg);
        setApiLoading(false);
        return;
      }
      setApiImageBase64(imageBase64);
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

        {/* 自动打印开关 */}
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded border">
          <div className="flex flex-col">
            <span className="text-sm font-medium">自动打印</span>
            <span className="text-xs text-gray-600">检测到用户变化时自动打印</span>
          </div>
          <button
            onClick={() => setAutoPrintEnabled(!autoPrintEnabled)}
            aria-label={`${autoPrintEnabled ? '关闭' : '开启'}自动打印`}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoPrintEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoPrintEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

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
