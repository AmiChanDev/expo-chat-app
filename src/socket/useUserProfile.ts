import { useState } from "react";
import { User, WSResponse } from "./chat";
import { useWebSocket } from "./WebSocketProvider";

export function useUserProfile() {
  const { socket, sendMessage } = useWebSocket();
  const [userProfile, setUserProfile] = useState<User>();

  if (!socket) return;

  return;
}
