import { WSResponse } from "./chat";
import { useWebSocket } from "./WebSocketProvider";

export function useUserProfile() {
  const { socket, sendMessage } = useWebSocket();

  if (!socket) return;

  const sendProfile = (image: string) => {
    sendMessage({ type: "set_user_profile", image });
    };
    
    

  return;
}
