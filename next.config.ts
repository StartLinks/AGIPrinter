import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    disableStaticImages: true, // 禁用静态图片优化（极端方案，不推荐）
    // 或仅关闭缓存（Next.js 12.1+）
    unoptimized: true, // 跳过图片优化，直接使用原图（无缓存）
  },
};

export default nextConfig;
