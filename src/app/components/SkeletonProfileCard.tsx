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

      <div className="flex mt-10 items-center gap-5 px-6 w-full">
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

      <div className=" bg-[#efefef] w-[calc(100%-3rem)] rounded-2xl">
        <div className="w-full  p-2">
          <div className="w-full flex relative items-stretch">
            {/* 左边内容区骨架屏 */}
            <div className="flex flex-col duration-300 gap-4 w-8/10 py-9 px-5 my-3 ml-3">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
