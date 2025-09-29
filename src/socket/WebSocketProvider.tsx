import React, { createContext, useContext, useEffect, useRef, useState } from "react";


interface WebSocketContextValue {
    socket: WebSocket | null;
    isConnected: boolean;
    userId: number,
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

    const sendMessage = (data: any) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ ...data, userId }));
        }
    }

    return (
        <webSocketContext.Provider
            value={{
                socket: socketRef.current,
                isConnected,
                userId,
                sendMessage,
            }}>
            {children}
        </webSocketContext.Provider>)
};


export const useWebSocket = () => {
    const ctx = useContext(webSocketContext);
    if (!ctx) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return ctx;
}