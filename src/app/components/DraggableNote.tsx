'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import NoStyleTextarea from './NoStyleInput';

interface DraggableNoteProps {
    className?: string;
}

export default function DraggableNote({
    className = ""
}: DraggableNoteProps) {
    const [note, setNote] = useState<string>("来找我玩！😎");

    const [position, setPosition] = useState({ x: 345, y: 456 });
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
    }, []);

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
                '--note-left': `${position.x}px`,
                '--note-top': `${position.y}px`
            } as React.CSSProperties}
            onMouseDown={handleMouseDown}
        >
            <div className="drag-handle">
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
                <NoStyleTextarea onChange={setNote} value={note} />
            </div>
        </div>
    );
}
