import { useEffect, useState } from "react";
import { User, WSResponse } from "./chat";
import { useWebSocket } from "./WebSocketProvider";

export function useSendNewContact() {
  const { sendMessage, socket } = useWebSocket();
  const [responseText, setResponseText] = useState("");
  const [responseStatus, setResponseStatus] = useState<boolean | null>(null);

  const sendNewContact = (user: User) => {
    sendMessage({ type: "save_new_contact", user });
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      if (response.type === "new_contact_response_text") {
        console.log(response.payload.message);
        setResponseStatus(response.payload.responseStatus);
        setResponseText(response.payload.message);
      }
    };

    socket?.addEventListener("message", onMessage);
    return () => {
      socket?.removeEventListener("message", onMessage);
    };
  }, [socket]);

  return { sendNewContact, responseText, responseStatus };
}
