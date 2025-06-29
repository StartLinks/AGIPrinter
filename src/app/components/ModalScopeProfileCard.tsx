"use client";

import Image from "next/image";
import { ProfileType } from "../type/profile";

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
      <div className="flex mt-12 items-center gap-5 px-6 w-full">
        <div className="flex gap-5 items-center">
          <Image
            src={
              data?.avatar ||
              "https://cdn.bonjour.bio/static/image/defaultAvatar.svg"
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
                src="/modalScope/folder.svg"
                alt="Folder"
                width={50}
                height={50}
                className="w-12 h-12"
              />
              <div className="text-sm font-medium ">
                {tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Image
        src="/modalScope/tabbar.svg"
        alt="Tab"
        width={800}
        height={100}
        className="w-[calc(100%-3rem)] -mt-20"
      />

      <div className="w-[calc(100%-3rem)] relative bg-[#F7F7F7] rounded-xl space-y-4 py-6 px-5">
        <div className="line-clamp-5 text-xl font-semibold whitespace-pre-line">
          {data?.description ||
            "This is a placeholder description. Please update your profile with a meaningful description."}
        </div>
        <div className="bg-white w-fit border text-xl items-center font-semibold border-black rounded-xl px-4.5 py-2 flex gap-3">
          <Image
            src="/modalScope/face.svg"
            alt="face"
            width={24}
            height={24}
            className="size-8"
          />
          添加友链
        </div>
        <Image
          src="/modalScope/arrowRT.svg"
          alt="QR Code"
          width={200}
          height={200}
          className="size-8 absolute right-8 bottom-6"
        />
      </div>

      <Image
        src="/modalScope/face.svg"
        alt="face"
        width={200}
        height={200}
        className="size-30 absolute bottom-24 left-8"
      />

      <div className="absolute bottom-12 left-35 flex items-center gap-2 flex-col">
        <Image
          src="/modalScope/folder.svg"
          alt="Bonjour Folder"
          width={61 * 0.8}
          height={61}
          className=" w-12"
        />
        <div className="px-2 bg-black text-white">ModelScope</div>
      </div>

      <div className="absolute bottom-36 left-60 flex items-center gap-2 flex-col">
        <Image
          src="/modalScope/folder.svg"
          alt="Bonjour Folder"
          width={61 * 0.8}
          height={61}
          className=" w-12"
        />
        <div className="px-2 bg-black text-white">ModelScope</div>
      </div>


      <Image
        src="/hand.svg"
        alt="Hand"
        width={100}
        height={100}
        className="absolute bottom-5 left-47 size-10"
      />

      <div className="flex flex-col gap-2 items-center z-1 absolute bottom-12 right-10">
        <Image
          src="/modalScope/Sticker.svg"
          alt="Sticker"
          width={120}
          height={120}
          className="size-32"
        />
        <div className="text-xl text-[#624AFF]">手机 NFC 贴贴</div>
      </div>
    </div>
  );
}
