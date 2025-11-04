// lib/useFonts.ts
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from "@expo-google-fonts/josefin-sans";

export default function useLoadedFonts(): boolean {
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });
  return fontsLoaded;
}
