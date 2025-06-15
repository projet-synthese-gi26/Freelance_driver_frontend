import { createContext, useContext } from 'react';

export interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  themeColor: '#0066FF',
  setThemeColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);