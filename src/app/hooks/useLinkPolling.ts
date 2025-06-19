import { useEffect, useRef, useState } from "react";

interface LinkPollingOptions {
    interval?: number; // 轮询间隔，默认 2000ms
    onLinkChange?: (link: string) => void; // link 变化时的回调
    onError?: (error: Error) => void; // 错误回调
}

export function useLinkPolling({
    interval = 2000,
    onLinkChange,
    onError,
}: LinkPollingOptions = {}) {
    const [currentLink, setCurrentLink] = useState<string>("");
    const [isPolling, setIsPolling] = useState(false);
    const previousLinkRef = useRef<string>("");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchLink = async () => {
        try {
            const response = await fetch("/api/link");
            const data = await response.json();

            if (data.success && data.link !== previousLinkRef.current) {
                previousLinkRef.current = data.link;
                setCurrentLink(data.link);

                // 调用变化回调
                if (onLinkChange) {
                    onLinkChange(data.link);
                }
            }
        } catch (error) {
            console.error("Error fetching link:", error);
            if (onError) {
                onError(error as Error);
            }
        }
    };

    const startPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setIsPolling(true);

        // 立即执行一次
        fetchLink();

        // 设置定时器
        intervalRef.current = setInterval(fetchLink, interval);
    };

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPolling(false);
    };

    // 清理函数
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        currentLink,
        isPolling,
        startPolling,
        stopPolling,
        fetchLink,
    };
}
