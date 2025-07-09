"use client";


interface SkeletonProfileCardProps {
  showError?: boolean;
  errorMessage?: string;
}

export default function SkeletonProfileCard({
  showError = false,
  errorMessage = "用户不存在或加载失败"
}: SkeletonProfileCardProps) {
  return (
    <div
      id="print-area"
      className="aspect-[210/297] w-[595px] h-[842px] flex flex-col items-center gap-8 bg-white relative smooth-transition skeleton-fade-in"
    >
      <div className="w-full h-5 skeleton-pulse"></div>

      <div className="flex items-center gap-5 px-6 w-full">
        <div className="flex gap-5 items-center">
          {/* 头像骨架屏 */}
          <div className="size-40 rounded-full shrink-0  skeleton-pulse" />

          <div className="flex flex-col gap-5 justify-around">
            {/* 名字骨架屏 */}
            <div className="h-12 w-48  rounded skeleton-pulse" />

            <div className="space-y-2">
              <div className="h-8 w-64  rounded skeleton-pulse" />
              <div className="h-6 w-40  rounded skeleton-pulse" />
              <div className="h-6 w-24  rounded skeleton-pulse" />
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-col shrink-0 justify-around gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="size-12 skeleton-pulse"></div>
              <div className="h-4 w-16  rounded skeleton-pulse mt-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full px-6">
        <div className="w-full h-8 skeleton-pulse"></div>
        <div className="w-full">
          <div className="w-full p-2 flex bg-gray-100  relative items-stretch">
            {/* 左边内容区骨架屏 */}
            <div className="flex flex-col duration-300 gap-4 w-full py-9 px-5 my-3 ml-3 border-gray-100 border-y-3">
              {showError ? (
                <div className="flex flex-col items-center justify-center h-32 gap-2">
                  <div className="text-red-500 text-xl ">⚠️</div>
                  <div className="text-red-500 text-lg  text-center">
                    {errorMessage}
                  </div>
                  <div className="text-gray-500 text-sm  text-center">
                    请检查用户名是否正确
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-6 w-full  rounded skeleton-pulse" />
                  <div className="h-6 w-5/6  rounded skeleton-pulse" />
                  <div className="h-6 w-4/5  rounded skeleton-pulse" />
                  <div className="h-6 w-3/4  rounded skeleton-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="size-48 rounded-full z-1 absolute bottom-6 right-6 opacity-50 skeleton-pulse"
      />
    </div>
  );
}
