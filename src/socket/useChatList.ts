import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, WSResponse } from "./chat";

export function useChatList(): Chat[] {
  const { socket, sendMessage } = useWebSocket();
  const [chatList, setChatList] = useState<Chat[]>([]);

  useEffect(() => {
    if (!socket) return;

    sendMessage({ type: "get_chat_list" });

    const onMessage = (event: MessageEvent) => {
      let response: WSResponse = JSON.parse(event.data);
      // console.log(response.payload);
      if (response.type == "friend_list") {
        setChatList(response.payload);
      }

      // if (data.type === "friend_list") {
      //   setChatList(data.data);
      //   console.log("Chat list updated:", data.data);
      // }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, sendMessage]);

  return chatList;
}
