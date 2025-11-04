// styled.d.ts
import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    colors: {
      background: string;
      panel: string;
      text: string;
      subtext: string;
      muted: string;
      primary: string;
      accent: string;
      border: string;
      shadow: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    sizes: {
      h1: number;
      body: number;
      bodyLarge: number;
    };
  }
}

// Also augment the non-native styled-components name in case some imports use it:
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    colors: {
      background: string;
      panel: string;
      text: string;
      subtext: string;
      muted: string;
      primary: string;
      accent: string;
      border: string;
      shadow: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    sizes: {
      h1: number;
      body: number;
      bodyLarge: number;
    };
  }
}
