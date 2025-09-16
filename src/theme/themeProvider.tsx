import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import { createContext, useEffect, useState } from "react";

export type ThemeOption = "light" | "dark" | "system";
const THEME_KEY = "@app_color_scheme";

type ThemeContextType = {
    preference: ThemeOption,
    applied: "light" | "dark",
    setPreference: (themeOption: ThemeOption) => Promise<void>,
}

type ThemeProviderProps = {
    children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [preference, setPreferenceState] = useState<ThemeOption>("system");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_KEY);
                if (savedTheme === "light" || savedTheme === "dark") {
                    setPreferenceState(savedTheme);
                    setColorScheme(savedTheme);
                } else {
                    setPreferenceState("system");
                    setColorScheme("system");
                }
            } catch (error) {
                console.log("Error loading theme preference:", error);
            } finally {

            }
        };
    });
}