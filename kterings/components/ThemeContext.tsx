// ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeContextType = {
    theme: ColorSchemeName;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    // Force the theme to 'light'
    const theme: ColorSchemeName = 'light';

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
