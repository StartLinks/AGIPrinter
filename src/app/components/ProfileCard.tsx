"use client";

import Image from "next/image";
import { ProfileType } from "../type/profile";
import DraggableNote from "./DraggableNote";

interface ProfileCardProps {
  data?: ProfileType;
  tags: string[];
  notes: Array<{
    id: string;
    text: string;
    position: { x: number; y: number };
  }>;
  onUpdateNote: (noteId: string, text: string) => void;
  onUpdateNotePosition: (
    noteId: string,
    position: { x: number; y: number },
  ) => void;
  onRemoveNote: (noteId: string) => void;
}

export default function ProfileCard({
  data,
  tags,
  notes,
  onUpdateNote,
  onUpdateNotePosition,
  onRemoveNote,
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
      <Image
        src="/Menu bar.svg"
        alt="Menu bar"
        width={800}
        height={100}
        className="w-full"
      />

      <div className="flex items-center gap-5 px-6 w-full">
        <div className="flex gap-5 items-center">
          <Image
            src={
              data?.avatar ||
              "https://cdn.bonjour.bio/static/image/defaultAvatar.svg"
            }
            alt="Placeholder"
            width={200}
            height={200}
            className="size-40 object-cover rounded-full shrink-0 border border-black"
          />
          <div className="flex flex-col gap-5 justify-around">
            <div className="text-5xl font-bold font-fusion-pixel">
              {data?.name}
            </div>
            <div className="space-y-1 text-2xl font-medium">
              {data?.basicInfo?.current_doing && data?.basicInfo?.role && (
                <div className=" font-fusion-pixel">
                  {`${data.basicInfo.current_doing}@${data.basicInfo.role}`}
                </div>
              )}
              {data?.basicInfo?.region &&
                Object.values(data.basicInfo.region).every(
                  (v) => v !== undefined && v !== null && v !== "",
                ) && (
                  <div className=" font-fusion-pixel">
                    {Object.values(data.basicInfo.region)
                      .filter((v) => v !== undefined && v !== null && v !== "")
                      .join("，")}
                  </div>
                )}
              {data?.basicInfo?.gender && (
                <div className=" font-fusion-pixel">
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
                src="/folder.svg"
                alt="Folder"
                width={50}
                height={50}
                className="w-12 h-12"
              />
              <div className="text-xl font-medium font-finders-keepers">
                {tag}
              </div>
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
            {/* 左边内容区 */}
            <div className="flex flex-col duration-300 gap-4 w-8/10 py-9 px-5 my-3 ml-3 border-gray-100 border-y-3">
              <div className="line-clamp-5 text-xl font-fusion-pixel whitespace-pre-line">
                {data?.description ||
                  "This is a placeholder description. Please update your profile with a meaningful description."}
              </div>
              <div className="border-1 border-black bg-[#E6E6E6] py-1 px-2 w-full font-chi-kare-go">
                Type a message...
              </div>
            </div>

            <div className="w-9 border-2 ml-auto relative flex flex-col justify-between dot-matrix-bg-small">
              <Image
                src="/arrow.svg"
                alt="Arrow"
                width={50}
                height={50}
                className="size-9 -translate-y-[2px]"
              />

              <Image
                src="/Scrollbox.svg"
                alt="Arrow"
                width={50}
                height={50}
                className="size-9 rotate-x-180"
              />

              <Image
                src="/arrow.svg"
                alt="Arrow"
                width={50}
                height={50}
                className="size-9 translate-y-[2px] rotate-x-180"
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
        className=" w-25 absolute bottom-12 left-20"
      />

      <Image
        src="/BonjourFolder.svg"
        alt="Bonjour Folder"
        width={61 * 0.8}
        height={61}
        className=" w-15 absolute bottom-36 left-60"
      />

      <Image
        src="/hand.svg"
        alt="Hand"
        width={100}
        height={100}
        className="absolute bottom-5 left-36 size-10"
      />

      <div className="flex flex-col gap-2 items-center z-1 absolute bottom-6 right-6">
        <Image
          src="/Sticker.svg"
          alt="Sticker"
          width={120}
          height={120}
          className="size-32"
        />
        <div className="text-xl font-fusion-pixel">手机 NFC 贴贴</div>
      </div>

      {/* 便签组件 */}
      {/* {notes.map((note) => (
        <DraggableNote
          key={note.id}
          id={note.id}
          initialText={note.text}
          initialPosition={note.position}
          onTextChange={onUpdateNote}
          onPositionChange={onUpdateNotePosition}
          onDelete={onRemoveNote}
        />
      ))} */}


      <DraggableNote
        id="note-1"
        initialText={"快来和我添加友链!👇"}
        initialPosition={{
          x: 345,
          y: 526,
        }}
      />


      <DraggableNote
        id="note-1"
        initialText={"来找我玩！😎"}
        initialPosition={{
          x: 44,
          y: 588,
        }}
      />
    </div>
  );
}
