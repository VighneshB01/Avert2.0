import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar, useColorScheme } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { getColors } from "@/constants/colors";
import { useThemeStore } from "@/store/theme-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const systemColorScheme = useColorScheme();
  const { mode, setMode } = useThemeStore();
  const colors = getColors();

  // Initialize theme based on system preference
  useEffect(() => {
    if (mode === 'system') {
      setMode('system');
    }
  }, [systemColorScheme]);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar 
        barStyle={mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark') ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const colors = getColors();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen 
        name="government-directives" 
        options={{ 
          title: "Government Directives",
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="community-reports" 
        options={{ 
          title: "Community Reports",
          presentation: "card"
        }} 
      />
    </Stack>
  );
}