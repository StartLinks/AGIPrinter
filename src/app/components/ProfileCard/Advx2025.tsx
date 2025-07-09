"use client";

import Image from "next/image";
import { ProfileType } from "../../type/profile";

interface ProfileCardProps {
  data?: ProfileType;
  tags: string[];
}

const headerBarArr = ['File', 'Edit', 'View', 'Special', 'Help'];

export default function Advx2025ProfileCard({
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
      <div className=" flex items-center font-['Orbix'] w-full p-0.5 bg-[#E74F09] px-1 gap-4">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          className="size-3.5 object-contain "
        />
        {headerBarArr.map((item, index) => (
          <div
            key={index}
            className={`text-xs text-white ${index === 0 ? "px-3 bg-white text-[#E74F09]!" : ""}`}
          >
            {item}
          </div>
        ))}
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
            <div className="text-4xl font-['Orbix']">
              <span className="text-[#E74F09]">{'{'}</span>
              {data?.name}
              <span className="text-[#E74F09]">{'}'}</span>
            </div>
            <div className="space-y-1 text-xl">
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

        <div className="ml-auto font-['Orbix'] flex flex-col shrink-0 justify-around">
          {tags.map((tag, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src="/Advx2025/folder.png"
                alt="Folder"
                width={380}
                height={290}
                className="size-12 object-contain"
              />
              <div className="text-xs font-medium text-nowrap">
                {tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[calc(100%-3rem)] relative rounded-xl space-y-4 px-8 py-10">
        {/* Top-left corner */}
        <div className="h-14 w-18 border-t-2 rounded-tl-4xl border-l-2 absolute top-0 left-0 border-[#FF5600]"></div>
        {/* Top-right corner */}
        <div className="h-14 w-18 border-t-2 rounded-tr-4xl border-r-2 absolute top-0 right-0 border-[#FF5600]"></div>
        {/* Bottom-left corner */}
        <div className="h-14 w-18 border-b-2 rounded-bl-4xl border-l-2 absolute bottom-0 left-0 border-[#FF5600]"></div>
        {/* Bottom-right corner */}
        <div className="h-14 w-18 border-b-2 rounded-br-4xl border-r-2 absolute bottom-0 right-0 border-[#FF5600]"></div>

        <Image
          src="/Advx2025/advx.png"
          alt="advx"
          width={200}
          height={200}
          className="w-18 h-9 object-contain absolute right-8 top-6"
        />

        <div className="text-xl font-['Orbix']"><span className=" text-[#FF5600]">/</span> About Me</div>
        <div className="line-clamp-5 text-lg whitespace-pre-line">
          {data?.description ||
            "This is a placeholder description. Please update your profile with a meaningful description."}
        </div>
        <div className="bg-black ml-auto text-white w-fit border text-lg items-center rounded-xl px-4.5 py-2 flex gap-3">
          <Image
            src="/Advx2025/flash.png"
            alt="face"
            width={320}
            height={170}
            className="h-6 w-4 object-contain"
          />
          添加友链
        </div>
      </div>

      <Image
        src="/Advx2025/fire.png"
        alt="fire"
        width={500}
        height={500}
        className="size-32 object-cover absolute bottom-32 left-8"
      />

      <div className="absolute bottom-12 left-35 flex items-center gap-2 flex-col">
        <Image
          src="/Advx2025/folder.png"
          alt="Bonjour Folder"
          width={61 * 0.8}
          height={61}
          className=" w-12"
        />
        <div className="px-2 bg-black text-white text-sm font-['Orbix'] ">
          <span className="text-[#E74F09]">{'{'}</span>
          Adventure X
          <span className="text-[#E74F09]">{'}'}</span></div>
      </div>

      <div className="absolute bottom-36 left-60 flex items-center gap-2 flex-col">
        <Image
          src="/Advx2025/folder.png"
          alt="Bonjour Folder"
          width={61 * 0.8}
          height={61}
          className=" w-12"
        />
        <div className="px-2 bg-black text-white text-sm font-['Orbix'] ">
          <span className="text-[#E74F09]">{'{'}</span>
          Bonjour
          <span className="text-[#E74F09]">{'}'}</span></div>
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
          src="/Advx2025/Sticker.png"
          alt="Sticker"
          width={120}
          height={120}
          className="size-32"
        />
        <div className="text-xl text-nowrap text-[#E74F09]">手机 NFC 贴贴</div>
      </div>

    </div>
  );
}
