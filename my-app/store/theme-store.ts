import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      isDark: false,
      
      setMode: (mode: ThemeMode) => {
        set({ 
          mode,
          // We'll update isDark in the component based on system preference
          isDark: mode === 'dark'
        });
      },
      
      toggleTheme: () => {
        set((state) => {
          const currentMode = state.mode;
          if (currentMode === 'light') {
            return { mode: 'dark', isDark: true };
          } else if (currentMode === 'dark') {
            return { mode: 'system', isDark: false };
          } else {
            return { mode: 'light', isDark: false };
          }
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);