/**
 * SVG生成相关的工具函数
 */

import { readFileSync } from "fs";
import { join } from "path";

/**
 * 创建完整的SVG内容
 * @param options SVG生成选项
 * @returns 完整的SVG字符串
 */
export interface SvgOptions {
  width?: number;
  height?: number;
  fontStyles?: string;
  timestamp?: string;
}

export function createSvgContent(options: SvgOptions = {}): string {
  const {
    width = 794, // A4宽度 210mm @ 96 DPI
    height = 1123, // A4高度 297mm @ 96 DPI
    fontStyles = "",
    timestamp = new Date().toLocaleString("zh-CN"),
  } = options;

  try {
    // 读取 poster.svg 模板文件
    const templatePath = join(process.cwd(), "public", "poster.svg");
    let svgTemplate = readFileSync(templatePath, "utf-8");

    // 计算缩放比例
    const originalWidth = 603;
    const originalHeight = 850;
    const scaleX = width / originalWidth;
    const scaleY = height / originalHeight;

    // 更新 SVG 尺寸和 viewBox
    svgTemplate = svgTemplate.replace(
      /width="603" height="850" viewBox="0 0 603 850"/,
      `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`,
    );

    // 添加字体样式（如果提供）
    if (fontStyles) {
      svgTemplate = svgTemplate.replace(
        /<svg([^>]*)>/,
        `<svg$1>${fontStyles}`,
      );
    }

    // 添加缩放变换到主要内容
    svgTemplate = svgTemplate.replace(
      /<g clip-path="url\(#clip0_0_992\)"([^>]*)>/,
      `<g clip-path="url(#clip0_0_992)"$1 transform="scale(${scaleX}, ${scaleY})">`,
    );

    // 添加时间戳（在 SVG 底部）
    const timestampY = height - 40;
    const timestampElement = `
      <!-- 时间戳 -->
      <text fill="#cccccc" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="16" letter-spacing="0em">
        <tspan x="30" y="${timestampY}">CreateTime: ${timestamp}</tspan>
      </text>
    `;

    // 在 SVG 结束标签前插入时间戳
    svgTemplate = svgTemplate.replace("</svg>", `${timestampElement}</svg>`);

    return svgTemplate;
  } catch (error) {
    console.error("Error reading poster.svg template:", error);
    // 如果读取模板失败，返回之前的硬编码版本作为后备
    return createFallbackSvgContent(options);
  }
}

/**
 * 后备的 SVG 生成函数（当模板文件读取失败时使用）
 */
function createFallbackSvgContent(options: SvgOptions = {}): string {
  const {
    width = 794,
    height = 1123,
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 错误提示背景 -->
      <rect width="${width}" height="${height}" fill="#f8f9fa"/>
      
      <!-- 错误图标 -->
      <circle cx="${width / 2}" cy="${
    height / 2 - 60
  }" r="30" fill="#dc3545" opacity="0.1"/>
      <text x="${width / 2}" y="${
    height / 2 - 50
  }" text-anchor="middle" fill="#dc3545" font-family="Arial" font-size="36" font-weight="bold">!</text>
      
      <!-- 错误提示文本 -->
      <text x="${width / 2}" y="${
    height / 2 + 20
  }" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="18">模板文件读取失败</text>
      <text x="${width / 2}" y="${
    height / 2 + 50
  }" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="14">请检查 poster.svg 文件是否存在</text>
    </svg>
  `;
}

/**
 * 获取禁用缓存的HTTP头
 * @returns 缓存控制头对象
 */
export function getNoCacheHeaders() {
  return {
    "Content-Type": "image/svg+xml",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };
}
