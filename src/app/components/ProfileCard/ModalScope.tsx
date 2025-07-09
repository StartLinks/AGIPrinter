"use client";

import Image from "next/image";
import { ProfileType } from "../../type/profile";

interface ProfileCardProps {
  data?: ProfileType;
  tags: string[];
}

export default function ModalScopeProfileCard({
  data,
  tags,
}: ProfileCardProps) {
  return (
    <div
      id="print-area"
      className="aspect-[210/297] w-[595px] h-[842px] flex flex-col items-center gap-8 bg-white relative smooth-transition"
      style={{
        animation: "skeletonFadeIn 0.4s ease-in-out",
        animationDelay: "0.1s",
        animationFillMode: "both",
      }}
    >
      <div className="-mb-10">
        <Image
          src="/modalScope/menuBar.png"
          alt="Menu bar"
          width={595}
          height={20}
          className="w-full"
        />
        <div className="flex justify-between w-full">
          <div className="w-8 h-10 relative">
            <div className="w-8 h-5 bg-teal-400" />
            <div className="w-5 h-5 bg-indigo-500" />
          </div>
          <div className="w-8 h-10 relative flex flex-col items-end">
            <div className="w-8 h-5 bg-teal-400" />
            <div className="w-5 h-5 bg-indigo-500" />
          </div>
        </div>
      </div>


      <div className="flex items-center gap-5 px-6 w-full">
        <div className="flex gap-5 items-center">
          <Image
            src={
              data?.avatar ||
              "https://cdn.bonjour.bio/static/image/defaultAvatar.png"
            }
            alt="Placeholder"
            width={200}
            height={200}
            className="size-40 object-cover rounded-full shrink-0"
          />
          <div className="flex flex-col gap-3 justify-around">
            <div className="text-4xl font-bold ">
              {data?.name}
            </div>
            <div className="space-y-1 text-xl font-medium">
              {data?.basicInfo?.current_doing && data?.basicInfo?.role && (
                <div className=" ">
                  {`${data.basicInfo.current_doing}@${data.basicInfo.role}`}
                </div>
              )}
              {data?.basicInfo?.region &&
                Object.values(data.basicInfo.region).every(
                  (v) => v !== undefined && v !== null && v !== "",
                ) && (
                  <div className=" ">
                    {Object.values(data.basicInfo.region)
                      .filter((v) => v !== undefined && v !== null && v !== "")
                      .join("，")}
                  </div>
                )}
              {data?.basicInfo?.gender && (
                <div className=" ">
                  {data.basicInfo.gender}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-col shrink-0 justify-around">
          {tags.map((tag, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src="/modalScope/folder.png"
                alt="Folder"
                width={3900}
                height={3000}
                className="size-12 object-contain"
              />
              <div className="text-sm font-medium text-nowrap">
                {tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Image
        src="/modalScope/tabbar.png"
        alt="Tab"
        width={800}
        height={100}
        className="w-[calc(100%-3rem)] -mt-20"
      />

      <div className="w-[calc(100%-3rem)] relative bg-[#EDF3FF] rounded-xl space-y-4 py-6 px-5">
        <div className="line-clamp-5 text-xl font-semibold whitespace-pre-line">
          {data?.description ||
            "This is a placeholder description. Please update your profile with a meaningful description."}
        </div>
        <div className="bg-white w-fit border text-xl items-center font-semibold border-black rounded-xl px-4.5 py-2 flex gap-3">
          <Image
            src="/modalScope/face.png"
            alt="face"
            width={320}
            height={170}
            className="w-8 h-4 object-cover"
          />
          添加友链
        </div>
        <Image
          src="/modalScope/arrowRT.png"
          alt="QR Code"
          width={200}
          height={200}
          className="size-8 absolute right-8 bottom-6"
        />
      </div>

      <Image
        src="/modalScope/face.png"
        alt="face"
        width={640}
        height={340}
        className="w-32 h-16 object-cover absolute bottom-32 left-8"
      />

      <div className="absolute bottom-12 left-35 flex items-center gap-2 flex-col">
        <Image
          src="/modalScope/folder.png"
          alt="Bonjour Folder"
          width={61 * 0.8}
          height={61}
          className=" w-12"
        />
        <div className="px-2 bg-black text-white">ModelScope</div>
      </div>

      <div className="absolute bottom-36 left-60 flex items-center gap-2 flex-col">
        <Image
          src="/modalScope/folder.png"
          alt="Bonjour Folder"
          width={61 * 0.8}
          height={61}
          className=" w-12"
        />
        <div className="px-2 bg-black text-white">ModelScope</div>
      </div>


      <Image
        src="/modalScope/hand.png"
        alt="Hand"
        width={200}
        height={200}
        className="absolute bottom-5 left-47 size-10"
      />

      <div className="flex flex-col gap-2 items-center z-1 absolute bottom-12 right-10">
        <Image
          src="/modalScope/Sticker.png"
          alt="Sticker"
          width={120}
          height={120}
          className="size-32"
        />
        <div className="text-xl text-nowrap text-[#624AFF]">手机 NFC 贴贴</div>
      </div>


      <div className="w-5 h-5 bg-teal-400 absolute bottom-12 left-24" />

      <div className="flex fixed bottom-0 justify-between w-full">
        <div className="w-8 h-10 relative">
          <div className="w-5 h-5 bg-indigo-500" />
          <div className="w-8 h-5 bg-teal-400" />
        </div>
        <div className="w-8 h-10 relative flex flex-col items-end">
          <div className="w-5 h-5 bg-indigo-500" />
          <div className="w-8 h-5 bg-teal-400" />
        </div>
      </div>
    </div>
  );
}
