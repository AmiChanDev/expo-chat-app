import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, User, WSResponse } from "./chat";

export function useSingleChat(friendId: number) {
  const { socket, sendMessage } = useWebSocket();
  const [messages, setMessage] = useState<Chat[]>([]);
  const [friend, setFriend] = useState<User>();

  useEffect(() => {
    if (!socket) {
      return;
    }
    sendMessage({ type: "get_single_chat", friendId });
    sendMessage({ type: "friend_data", friendId });

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      // console.log("Received WebSocket message:", response);

      if (response.type == "single_chat") {
        console.log("Setting initial chat messages");
        // console.log("Setting initial chat messages:", response.payload);
        setMessage(response.payload);
      }

      if (response.type == "new_message") {
        const newMessage = response.payload;
        // console.log("Received new message:", newMessage);
        // Add new message if it's part of this chat (either sent to or from the friend)
        if (newMessage.to.id === friendId || newMessage.from.id === friendId) {
          console.log("Adding new message to chat");
          setMessage((prevMessages) => [...prevMessages, newMessage]);
        }
      }

      if (response.type == "friend_data") {
        setFriend(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, friendId]);

  return { messages: messages, friend: friend };
}
