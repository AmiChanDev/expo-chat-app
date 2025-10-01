import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { User, WSResponse } from "./chat";

export function getAllUsers(): User[] {
  const { socket, sendMessage } = useWebSocket();
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    if (!socket) return;

    sendMessage({ type: "get_all_users" });

    const onMessage = (event: MessageEvent) => {
      let response: WSResponse = JSON.parse(event.data);
      console.log(response.payload);
      console.log("All users recieved");
      if (response.type == "get_all_users") {
        setUserList(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, sendMessage]);

  return userList;
}
