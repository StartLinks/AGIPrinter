import { useEffect, useState } from "react";

type PageState = "idle" | "loading" | "success" | "error";

interface UsePageStateProps {
    isLoading: boolean;
    error: Error | null;
    data: unknown;
    debouncedUsername: string;
}

export function usePageState(
    { isLoading, error, data, debouncedUsername }: UsePageStateProps,
) {
    const [currentState, setCurrentState] = useState<PageState>("idle");
    const [isTransitioning, setIsTransitioning] = useState(false);

    // 延迟状态切换，避免快速闪烁
    const [delayedState, setDelayedState] = useState<PageState>("idle");

    useEffect(() => {
        // 确定新状态
        let newState: PageState = "idle";

        if (!debouncedUsername) {
            newState = "idle";
        } else if (isLoading) {
            newState = "loading";
        } else if (error) {
            newState = "error";
        } else if (data) {
            newState = "success";
        }

        // 如果状态没有变化，直接返回
        if (newState === currentState) {
            return;
        }

        // 开始过渡
        setIsTransitioning(true);

        // 短暂延迟后更新状态，避免快速切换
        const timeoutId = setTimeout(() => {
            setCurrentState(newState);
            setDelayedState(newState);

            // 过渡完成
            setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        }, 150);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isLoading, error, data, debouncedUsername, currentState]);

    return {
        currentState: delayedState,
        isTransitioning,
        shouldShowSkeleton: delayedState === "loading" ||
            delayedState === "idle",
        shouldShowError: delayedState === "error",
        shouldShowContent: delayedState === "success",
    };
}
