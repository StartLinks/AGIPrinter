import { useEffect, useRef } from "react";

interface NFCMessage {
    type: string;
    data: {
        type: string;
        data: string;
    };
    target?: string;
}

interface UseNFCProfileListenerOptions {
    /**
     * 传入的 setUsername 方法，更新页面 username
     */
    setUsername: (username: string) => void;
    /**
     * WebSocket token，通常为 nfcService_xxx
     */
    wsToken?: string;
    /**
     * shorts 查询接口 baseUrl
     */
    shortsApiBase?: string;
    /**
     * shorts 查询接口 token
     */
    shortsApiToken?: string;
    /**
     * 是否启用监听，默认true
     */
    enabled?: boolean;
}

/**
 * 监听 NFC WebSocket，自动处理 wx_link/profile_link，自动查 shorts 表并更新 username
 */
export function useNFCProfileListener({
    setUsername,
    wsToken = "nfcService",
    shortsApiBase =
        "https://fc-mp-b1a9bc8c-0aab-44ca-9af2-2bd604163a78.next.bspapp.com/admin/database",
    shortsApiToken = "FB1CAA48-C25E-4693-9BBC-A8C56540333B",
    enabled = true,
}: UseNFCProfileListenerOptions) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!enabled) return;
        // 连接 WebSocket
        const ws = new WebSocket(`wss://nfcws.bonjour.bio?token=${wsToken}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("NFC WebSocket 连接已建立");
        };

        ws.onmessage = async (event) => {
            console.log("NFC WebSocket 收到消息:", event.data);

            try {
                const msg: NFCMessage = JSON.parse(event.data);
                if (msg.type !== "nfcData" || !msg.data) return;
                const { type, data } = msg.data;
                if (type === "profile_link") {
                    setUsername(data);
                } else if (type === "wx_link") {
                    // 查询 shorts 表
                    const url = `${shortsApiBase}/shorts?wx_link=${
                        encodeURIComponent(data)
                    }`;
                    const resp = await fetch(url, {
                        headers: { token: shortsApiToken },
                    });
                    const result = await resp.json();
                    if (
                        result.success && Array.isArray(result.data) &&
                        result.data.length > 0
                    ) {
                        const profileLink = result.data[0].profile_link;
                        if (profileLink) {
                            setUsername(profileLink);
                        }
                    }
                }
            } catch (e) {
                // 可选：console.error("NFC WS 处理消息失败", e);
            }
        };

        ws.onerror = (e) => {
            // 可选：console.error("NFC WebSocket 错误", e);
        };
        ws.onclose = () => {
            // 可选：console.log("NFC WebSocket 已关闭");
        };
        return () => {
            ws.close();
        };
    }, [setUsername, wsToken, shortsApiBase, shortsApiToken, enabled]);
}
