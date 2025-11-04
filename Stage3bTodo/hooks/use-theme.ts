import { useTheme } from "styled-components/native";

export type ColorScheme = {
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  backgrounds: {
    input: string;
    editInput: string;
  };
};

// Optional helper if you want to pull colors from the styled theme:
export function useColors(): ColorScheme {
  const t = useTheme();
  // Keep this mapping aligned with your light/dark theme objects
  return t.colors as unknown as ColorScheme;
}
