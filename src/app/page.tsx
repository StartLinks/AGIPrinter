"use client";

import Image from "next/image";
import { useState } from "react";
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import DraggableNote from "./components/DraggableNote";
import NoStyleInput from "./components/NoStyleInput";
import { ProfileType } from "./type/profile";

// SWR fetcher函数
const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('SWR获取到的用户资料数据:', data);
  return data.data;
};

export default function Home() {
  const [tags, _settags] = useState<string[]>([
    "Product Manager",
    "Design",
    "iOS Dev"
  ]);

  // 用户名输入状态
  const [username, setUsername] = useState<string>("rabithua");

  // 防抖处理用户名，延迟500ms
  const [debouncedUsername] = useDebounce(username, 500);

  // 便签状态管理
  const [notes, setNotes] = useState<Array<{ id: string; text: string; position: { x: number; y: number } }>>([
    { id: 'note-1', text: '来找我玩！😎', position: { x: 345, y: 456 } }
  ]);

  // 添加便签
  const addNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      text: '新便签',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 200 }
    };
    setNotes(prev => [...prev, newNote]);
  };

  // 删除便签
  const removeNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  // 更新便签内容
  const updateNote = (noteId: string, text: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, text } : note
    ));
  };

  // 更新便签位置
  const updateNotePosition = (noteId: string, position: { x: number; y: number }) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, position } : note
    ));
  };

  // 打印功能
  const handlePrint = () => {
    const printContent = document.getElementById('print-area');
    if (!printContent) return;

    // 创建一个新窗口用于打印
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // 复制当前页面的样式
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          console.log('Error accessing stylesheet:', e);
          return '';
        }
      })
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Content</title>
          <style>
            ${styles}
            @media print {
              body { margin: 0; padding: 0; }
              .print-area { 
                width: 210mm !important; 
                height: 297mm !important; 
                margin: 0 auto !important;
                transform: none !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // 等待样式加载完成后打印
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // 使用SWR获取数据，根据防抖后的用户名动态请求
  const { data, error, isLoading } = useSWR<ProfileType>(
    debouncedUsername ? `https://fc-mp-b1a9bc8c-0aab-44ca-9af2-2bd604163a78.next.bspapp.com/profile/${debouncedUsername}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // 聚焦时不重新验证
      revalidateOnReconnect: true, // 重新连接时重新验证
      refreshInterval: 0, // 不自动刷新
    }
  );

  // 错误处理
  if (error) {
    console.error('SWR获取数据失败:', error);
  }

  // 加载状态
  if (isLoading) {
    console.log('SWR正在加载数据...');
  }

  return (
    <div className=" h-screen flex justify-center bg-blue-800 square-matrix-bg">
      <div className="flex gap-12 my-auto">
        <div className="flex h-fit flex-col border-2 border-dashed divide-y-1 divide-black bg-gray-50 font-fusion-pixel">
          <div className="flex flex-col gap-2 py-3  px-4">
            <div>专属链接</div>
            <div className="text-sm opacity-50 flex items-center">
              扫描右侧二维码，复制专属链接
              {isLoading && <span className="ml-2 text-blue-600">加载中...</span>}
              {error && <span className="ml-2 text-red-600">加载失败</span>}
            </div>
            <div className="flex items-center">
              https://bonjour.bio/
              <NoStyleInput
                aria-label="Profile Link"
                value={username}
                className="border-b border-black px-2 py-1 w-20!"
                onChange={(value) => {
                  setUsername(value);
                  console.log('Profile Link changed:', value);
                }}
                placeholder="rabithua"
              />
            </div>
            {debouncedUsername !== username && (
              <div className="text-xs text-gray-500">
                正在等待输入完成...
              </div>
            )}
          </div>

          {/* 便签管理区域 */}
          <div className="flex flex-col gap-3 py-3 px-4">
            <div>便签管理</div>
            <div className="flex gap-2">
              <button
                onClick={addNote}
                className="px-3 py-1 bg-blue-500 text-white text-sm border border-black hover:bg-blue-600 transition-colors"
              >
                添加便签
              </button>
              <button
                onClick={() => notes.length > 0 && removeNote(notes[notes.length - 1].id)}
                disabled={notes.length === 0}
                className="px-3 py-1 bg-red-500 text-white text-sm border border-black hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                删除便签
              </button>
            </div>
            <div className="text-xs text-gray-600">
              当前便签数量: {notes.length}
            </div>
          </div>

          {/* 打印功能区域 */}
          <div className="flex flex-col gap-3 py-3 px-4">
            <div>打印功能</div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-500 text-white text-sm border border-black hover:bg-green-600 transition-colors font-medium"
            >
              🖨️ 打印右侧内容
            </button>
            <div className="text-xs text-gray-600">
              点击按钮打印右侧卡片内容
            </div>
          </div>

          <Image
            src="/qrcode.png"
            alt="Logo"
            width={100}
            height={100}
            className="size-48 my-5 mx-auto border-2 p-3 bg-white rounded-3xl"
            style={{ boxShadow: '0 0 25px rgba(255, 255, 255, 0.8)' }}
          />
        </div>
        <div
          id="print-area"
          className=" aspect-[210/297] w-[595px] h-[842px] flex flex-col items-center gap-8 bg-white relative"
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
                src={data?.avatar || "https://cdn.bonjour.bio/static/image/defaultAvatar.svg"} // 使用SWR获取的头像或占位图
                alt="Placeholder"
                width={200}
                height={200}
                className="size-40 object-cover rounded-full shrink-0 border border-black"
              />
              <div className="flex flex-col gap-5 justify-around">
                <div className="text-5xl font-bold font-fusion-pixel">{data?.name}</div>
                <div className="space-y-1">
                  {
                    (data?.basicInfo?.current_doing && data?.basicInfo?.role) && (
                      <div className="text-3xl font-medium font-fusion-pixel">{
                        `${data.basicInfo.current_doing}@${data.basicInfo.role}`
                      }</div>)}
                  {data?.basicInfo?.region &&
                    Object.values(data.basicInfo.region).every(v => v !== undefined && v !== null && v !== "") && (
                      <div className="text-2xl font-medium font-fusion-pixel">
                        {Object.values(data.basicInfo.region)
                          .filter(v => v !== undefined && v !== null && v !== "")
                          .join("，")}
                      </div>
                    )}
                  {data?.basicInfo?.gender && (
                    <div className="text-2xl font-medium font-fusion-pixel">
                      {data.basicInfo.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="ml-auto flex flex-col shrink-0 justify-around">
              {
                tags.map((tag, index) => (<div key={
                  index
                } className="flex flex-col items-center">
                  <Image
                    src="/folder.svg"
                    alt="Folder"
                    width={50}
                    height={50}
                    className="w-12 h-12"
                  />
                  <div className="text-xl font-medium font-finders-keepers">{tag}</div>
                </div>))
              }
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
                <div className="flex flex-col duration-300 gap-4 w-8/10 py-9 px-5 my-3 ml-3 border-gray-100 border-y-3">
                  <div className="line-clamp-5 text-xl font-fusion-pixel whitespace-pre-line">
                    {
                      data?.description || "This is a placeholder description. Please update your profile with a meaningful description."
                    }
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
            className="size-48 z-1 absolute bottom-6 right-6"
          />

          {/* 便签组件 */}
          {notes.map(note => (
            <DraggableNote
              key={note.id}
              id={note.id}
              initialText={note.text}
              initialPosition={note.position}
              onTextChange={updateNote}
              onPositionChange={updateNotePosition}
              onDelete={removeNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}