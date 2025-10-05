import { useEffect, useState } from "react";
import { User, WSResponse } from "./chat";
import { useWebSocket } from "./WebSocketProvider";

export function useUserProfile() {
  const { socket, sendMessage } = useWebSocket();
  const [userProfile, setUserProfile] = useState<User>();

  useEffect(() => {
    if (!socket) return;

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      if (response.type === "user_profile") {
        console.log(response.payload);
        setUserProfile(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket]);

  return userProfile;
}
