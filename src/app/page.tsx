import Image from "next/image";
import DraggableNote from "./components/DraggableNote";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className=" mx-auto aspect-[210/297] flex flex-col items-center gap-8 bg-white relative"
      >
        <Image
          src="/Menu bar.svg"
          alt="Menu bar"
          width={800}
          height={100}
          className="w-full"
        />

        <div className="flex gap-5 px-6 w-full">
          <Image
            src="/placeholder.svg"
            alt="Placeholder"
            width={200}
            height={200}
            className="w-40 rounded-full border border-black"
          />
          <div className="flex flex-col justify-around">
            <div className="text-5xl font-bold font-finders-keepers">name</div>
            <div className="space-y-1">
              <div className="text-3xl font-medium font-finders-keepers">currentdoing&role</div>
              <div className="text-3xl font-medium font-finders-keepers">currentdoing&role</div>
              <div className="text-3xl font-medium font-finders-keepers">currentdoing&role</div>
            </div>
          </div>
          <div className="ml-auto flex flex-col justify-around">
            <div className="flex flex-col items-center">
              <Image
                src="/folder.svg"
                alt="Folder"
                width={50}
                height={50}
                className="w-12 h-12"
              />
              <div className="text-xl font-medium font-finders-keepers">Folder</div>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/folder.svg"
                alt="Folder"
                width={50}
                height={50}
                className="w-12 h-12"
              />
              <div className="text-xl font-medium font-finders-keepers">Folder</div>
            </div>
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
          <div className="w-full border-4 border-black p-2 ">
            <div className="w-full flex border-2 border-black relative items-stretch">
              {/* 左边内容区 */}
              <div className="flex flex-col duration-300 gap-4 items-center w-8/10 py-9 px-5 my-3 ml-3 border-gray-100 border-y-3">
                <div className="line-clamp-5 text-xl font-fusion-pixel whitespace-pre-line">
                  👋🏻 Bonjour! 执剑人｜00 后创业 <br />
                  🎨 全干工程师 （产品｜设计｜iOS） <br />
                  🧑🏻‍🚀 02 年，但做了 3.5 年古典产品经理 <br />
                  🏛️ 想为文明留下些事物 <br />
                  😎 奇绩 @S25｜GreyMatter
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
                  className="size-9"
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
                  className="size-9 rotate-x-180"
                />
              </div>
            </div>

          </div>
        </div>

        <Image
          src="/agiFolder.svg"
          alt="AGI Folder"
          width={160}
          height={100}
          className="h-12 absolute bottom-12 left-10"
        />

        <Image
          src="/BonjourFolder.svg"
          alt="Bonjour Folder"
          width={250}
          height={100}
          className="h-12 absolute bottom-36 left-44"
        />

        <Image
          src="/Sticker.svg"
          alt="Sticker"
          width={250}
          height={250}
          className="size-48 z-1 absolute bottom-12 right-12"
        />

        {/* note */}
        <DraggableNote />
      </div>
    </div>
  );
}