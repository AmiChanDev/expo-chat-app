import { useEffect } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { WSResponse } from "./chat";

export function useWebSocketPing() {
  const { socket, isConnected, sendMessage } = useWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }
    const interval = 30000; // 30 seconds

    const pingTimer = setInterval(() => {
      sendMessage({ type: "ping" });
    }, interval);

    const onMessage = (event: MessageEvent<any>) => {
      const response: WSResponse = JSON.parse(event.data);
      if (response.type === "PONG") {
        console.log("WebSocket:PONG");
      }
    };

    socket.addEventListener("message", onMessage);
    return () => {
      clearInterval(pingTimer);
      if (socket) {
        socket.removeEventListener("message", onMessage);
      }
    };
  }, [socket, isConnected, sendMessage]);
}
