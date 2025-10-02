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
        // Close existing connection if it exists
        if (socketRef.current) {
            socketRef.current.close();
        }

        // Only connect if userId is valid (not 0 or null)
        if (userId && userId > 0) {
            console.log(`Connecting WebSocket for userId: ${userId}`);
            const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'localhost:8080';
            const fullUrl = `wss://${wsUrl}/ChatApp/chat?userId=${userId}`;
            console.log(`WebSocket URL: ${fullUrl}`);

            const socket = new WebSocket(fullUrl);

            socketRef.current = socket;
            socket.onopen = () => {
                console.log(`WebSocket Connected for userId: ${userId}`);
                setConnected(true)
            }

            socket.onclose = (event) => {
                console.log('WebSocket Disconnected....', event.code, event.reason);
                setConnected(false)
            }

            socket.onerror = (error) => {
                console.log('WebSocket Error:', error)
                setConnected(false)
            }

            // Removed onmessage here 
        } else {
            console.log('No valid userId, not connecting WebSocket');
            setConnected(false);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        }
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