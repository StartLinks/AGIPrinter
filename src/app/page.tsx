"use client";

import { useState } from "react";
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import ControlPanel from "./components/ControlPanel";
import ProfileCard from "./components/ProfileCard";
import SkeletonProfileCard from "./components/SkeletonProfileCard";
import { useNotes } from "./hooks/useNotes";
import { usePrint } from "./hooks/usePrint";
import { ProfileType } from "./type/profile";

// SWR fetcher函数
const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      // 根据状态码抛出不同的错误
      if (response.status === 404) {
        throw new Error('404: 用户不存在');
      } else if (response.status >= 500) {
        throw new Error('服务器错误，请稍后重试');
      } else if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后重试');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('SWR获取到的用户资料数据:', data);
    if (!data.success) {
      throw new Error('数据获取失败，请稍后重试');
    }
    return data.data;
  } catch (error) {
    // 处理网络错误
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络连接');
    }
    throw error;
  }
};

export default function Home() {
  const [tags] = useState<string[]>([
    "Product Manager",
    "Design",
    "iOS Dev"
  ]);

  // 用户名输入状态
  const [username, setUsername] = useState<string>("rabithua");

  // 防抖处理用户名，延迟500ms
  const [debouncedUsername] = useDebounce(username, 500);

  // 便签管理
  const {
    notes,
    addNote,
    removeLastNote,
    updateNote,
    updateNotePosition,
    removeNote
  } = useNotes([
    { id: 'note-1', text: '来找我玩！😎', position: { x: 345, y: 456 } }
  ]);

  // 打印功能
  const { handlePrint } = usePrint();

  // 使用SWR获取数据，根据防抖后的用户名动态请求
  const { data, error, isLoading } = useSWR<ProfileType>(
    debouncedUsername ? `https://fc-mp-b1a9bc8c-0aab-44ca-9af2-2bd604163a78.next.bspapp.com/profile/${debouncedUsername}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // 聚焦时不重新验证
      revalidateOnReconnect: true, // 重新连接时重新验证
      refreshInterval: 0, // 不自动刷新
      errorRetryCount: 3, // 最多重试3次
      errorRetryInterval: 1000, // 重试间隔1秒
      shouldRetryOnError: (error) => {
        // 404错误不重试，其他错误重试
        return !error.message.includes('404');
      },
      onError: (error) => {
        console.error('SWR获取数据失败:', error);
      },
      onSuccess: (data) => {
        console.log('SWR获取数据成功:', data);
      }
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

  // 渲染右侧内容的函数
  const renderRightPanel = () => {
    // 错误状态
    if (error) {
      return (
        <SkeletonProfileCard
          showError={true}
          errorMessage={error.message.includes('404') ? '用户不存在' : '数据加载失败'}
        />
      );
    }

    // 加载状态或无用户名
    if (isLoading || !debouncedUsername) {
      return <SkeletonProfileCard showError={false} />;
    }

    // 正常状态
    return (
      <ProfileCard
        data={data}
        tags={tags}
        notes={notes}
        onUpdateNote={updateNote}
        onUpdateNotePosition={updateNotePosition}
        onRemoveNote={removeNote}
      />
    );
  };

  return (
    <div className="h-screen flex justify-center bg-blue-800 square-matrix-bg">
      <div className="flex gap-12 my-auto">
        <ControlPanel
          username={username}
          onUsernameChange={setUsername}
          debouncedUsername={debouncedUsername}
          isLoading={isLoading}
          error={error}
          notes={notes}
          onAddNote={addNote}
          onRemoveNote={removeLastNote}
          onPrint={handlePrint}
        />

        {renderRightPanel()}
      </div>
    </div>
  );
}