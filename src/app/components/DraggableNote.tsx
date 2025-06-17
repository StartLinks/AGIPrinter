'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import NoStyleTextarea from './NoStyleInput';

interface DraggableNoteProps {
    className?: string;
    id: string;
    initialText?: string;
    initialPosition?: { x: number; y: number };
    onTextChange?: (id: string, text: string) => void;
    onPositionChange?: (id: string, position: { x: number; y: number }) => void;
    onDelete?: (id: string) => void;
}

export default function DraggableNote({
    className = "",
    id,
    initialText = "来找我玩！😎",
    initialPosition = { x: 345, y: 456 },
    onTextChange,
    onPositionChange,
    onDelete
}: DraggableNoteProps) {
    const [note, setNote] = useState<string>(initialText);
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const noteRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // 只在点击标题栏时开始拖拽
        if ((e.target as HTMLElement).closest('.drag-handle')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
            e.preventDefault();
        }
    }, [position]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            // 获取父容器的边界
            const parentElement = noteRef.current?.parentElement;
            if (parentElement && noteRef.current) {
                const parentRect = parentElement.getBoundingClientRect();
                const noteRect = noteRef.current.getBoundingClientRect();

                // 限制拖拽范围在父容器内
                const maxX = parentRect.width - noteRect.width;
                const maxY = parentRect.height - noteRect.height;

                setPosition({
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY))
                });
            }
        }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        // 当拖拽结束时，通知父组件位置变化
        if (onPositionChange) {
            onPositionChange(id, position);
        }
    }, [id, position, onPositionChange]);

    // 处理文本变化
    const handleTextChange = useCallback((newText: string) => {
        setNote(newText);
        if (onTextChange) {
            onTextChange(id, newText);
        }
    }, [id, onTextChange]);

    // 处理删除
    const handleDelete = useCallback(() => {
        if (onDelete) {
            onDelete(id);
        }
    }, [id, onDelete]);

    // 添加全局事件监听器
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={noteRef}
            className={`draggable-note ${className} ${isDragging ? 'dragging' : ''}`}
            style={{
                left: position.x,
                top: position.y
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="drag-handle relative">
                <Image
                    src="/noteHeader.svg"
                    alt="Note Header"
                    width={100}
                    height={100}
                    className="w-full h-auto"
                    draggable={false}
                />
            </div>
            <div className="p-3 font-fusion-pixel text-sm">
                <NoStyleTextarea onChange={handleTextChange} value={note} />
            </div>
        </div>
    );
}
