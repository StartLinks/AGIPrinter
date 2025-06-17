"use client";

import Image from "next/image";

interface SkeletonProfileCardProps {
  showError?: boolean;
  errorMessage?: string;
}

export default function SkeletonProfileCard({
  showError = false,
  errorMessage = "用户不存在或加载失败",
}: SkeletonProfileCardProps) {
  return (
    <div
      id="print-area"
      className="aspect-[210/297] w-[595px] h-[842px] flex flex-col items-center gap-8 bg-white relative smooth-transition skeleton-fade-in"
    >
      <Image
        src="/Menu bar.svg"
        alt="Menu bar"
        width={800}
        height={100}
        className="w-full"
      />

      <div className="flex items-center gap-5 px-6 w-full">
        <div className="flex gap-5 items-center">
          {/* 头像骨架屏 */}
          <div className="size-40 rounded-full shrink-0 border border-black bg-gray-200 skeleton-pulse" />

          <div className="flex flex-col gap-5 justify-around">
            {/* 名字骨架屏 */}
            <div className="h-12 w-48 bg-gray-200 rounded skeleton-pulse" />

            <div className="space-y-2">
              <div className="h-8 w-64 bg-gray-200 rounded skeleton-pulse" />
              <div className="h-6 w-40 bg-gray-200 rounded skeleton-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded skeleton-pulse" />
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-col shrink-0 justify-around gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src="/folder.svg"
                alt="Folder"
                width={50}
                height={50}
                className="w-12 h-12 opacity-50"
              />
              <div className="h-4 w-16 bg-gray-200 rounded skeleton-pulse mt-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full px-6">
        <Image
          src="/aboutmeBar.svg"
          alt="About Me Bar"
          width={800}
          height={100}
          className="w-full"
        />
        <div className="w-full border-4 border-black p-2">
          <div className="w-full flex border-2 border-black relative items-stretch">
            {/* 左边内容区骨架屏 */}
            <div className="flex flex-col duration-300 gap-4 w-8/10 py-9 px-5 my-3 ml-3 border-gray-100 border-y-3">
              {showError ? (
                <div className="flex flex-col items-center justify-center h-32 gap-4">
                  <div className="text-red-500 text-xl font-fusion-pixel">
                    ⚠️
                  </div>
                  <div className="text-red-500 text-lg font-fusion-pixel text-center">
                    {errorMessage}
                  </div>
                  <div className="text-gray-500 text-sm font-fusion-pixel text-center">
                    请检查用户名是否正确
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-6 w-full bg-gray-200 rounded skeleton-pulse" />
                  <div className="h-6 w-5/6 bg-gray-200 rounded skeleton-pulse" />
                  <div className="h-6 w-4/5 bg-gray-200 rounded skeleton-pulse" />
                  <div className="h-6 w-3/4 bg-gray-200 rounded skeleton-pulse" />
                </div>
              )}

              <div className="border-1 border-black bg-[#E6E6E6] py-1 px-2 w-full font-chi-kare-go opacity-50">
                Type a message...
              </div>
            </div>

            <div className="w-9 border-2 ml-auto relative flex flex-col justify-between dot-matrix-bg-small">
              <Image
                src="/arrow.svg"
                alt="Arrow"
                width={50}
                height={50}
                className="size-9 -translate-y-[2px] opacity-50"
              />

              <Image
                src="/Scrollbox.svg"
                alt="Arrow"
                width={50}
                height={50}
                className="size-9 rotate-x-180 opacity-50"
              />

              <Image
                src="/arrow.svg"
                alt="Arrow"
                width={50}
                height={50}
                className="size-9 translate-y-[2px] rotate-x-180 opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      <Image
        src="/agiFolder.svg"
        alt="AGI Folder"
        width={105 * 0.8}
        height={61}
        className="h-12 absolute bottom-12 left-10 opacity-50"
      />

      <Image
        src="/BonjourFolder.svg"
        alt="Bonjour Folder"
        width={61 * 0.8}
        height={61}
        className="h-12 absolute bottom-36 left-44 opacity-50"
      />

      <Image
        src="/Sticker.svg"
        alt="Sticker"
        width={120}
        height={120}
        className="size-48 z-1 absolute bottom-6 right-6 opacity-50"
      />
    </div>
  );
}
