import React, { createContext, useEffect, useRef, useState } from "react";


interface WebSocketContextValue {
    socket: WebSocket | null;
    isConnected: boolean;
    iserId: number,
    sendMessage: (date: any) => void;

}

const webSocketContext = createContext<WebSocketContextValue | null>(null);
export const WebSocketProvider: React.FC<{
    children: React.ReactNode
    userId: number
}> = ({ children, userId }) => {
    const [isConnected, setConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(`wss://${process.env.EXPO_PUBLIC_WS_URL}/ChatApp/chat?userId=${userId}`);

        socketRef.current = socket;
        socket.onopen = () => {
            console.log('WebSocket Connected....');
            setConnected(true)
        }

        socket.onclose = () => {
            console.log('WebSocket Disonnected....');
        }

        socket.onerror = (error) => {
            console.log(error)
            setConnected(false)
        }

        return () => { socket.close }
    }, [userId]);

};