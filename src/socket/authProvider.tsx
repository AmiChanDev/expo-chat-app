import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
    userId: string | null;
    isLoading: boolean;
    signUp: (id: string) => Promise<void>;
    signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const USER_ID_KEY = "userId"; // Key for storing user ID in AsyncStorage

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                console.log("Checking for stored user...");
                const storedUserId = await AsyncStorage.getItem(USER_ID_KEY);
                if (storedUserId) {
                    console.log("Found stored user ID:", storedUserId);
                    setUserId(storedUserId);
                } else {
                    console.log("No stored user found");
                }
            } catch (error) {
                console.warn("Error loading user ID from storage:", error);
            } finally {
                // Reduced loading time since AsyncStorage is fast
                setTimeout(() => {
                    setIsLoading(false);
                    console.log("Auth loading completed");
                }, 1000);
            }
        })();
    }, []);

    const signUp = async (id: string) => {
        try {
            console.log("Saving user ID to AsyncStorage:", id);
            await AsyncStorage.setItem(USER_ID_KEY, id);
            setUserId(id);
            console.log("User ID saved successfully");
        } catch (error) {
            console.error("Error saving user ID:", error);
        }
    };

    const signOut = async () => {
        try {
            console.log("Removing user ID from AsyncStorage");
            await AsyncStorage.removeItem(USER_ID_KEY);
            setUserId(null);
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const value = useMemo(() => ({ userId, isLoading, signUp, signOut }), [userId, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}