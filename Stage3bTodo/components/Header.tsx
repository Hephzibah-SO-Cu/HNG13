// components/Header.tsx
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import SunIcon from "@/assets/icons/sun.svg";
import MoonIcon from "@/assets/icons/moon.svg";

// Require the images
const lightHeaderImage = require("../assets/images/header_light.png");
const darkHeaderImage = require("../assets/images/header_dark.png");

export default function Header() {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  return (
    <ImageBackground
      source={isDarkMode ? darkHeaderImage : lightHeaderImage}
      style={styles.headerBackground}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>TODO</Text>
        <TouchableOpacity onPress={toggleTheme}>
          {isDarkMode ? (
            <SunIcon width={26} height={26} />
          ) : (
            <MoonIcon width={26} height={26} />
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    width: "100%",
    height: Platform.OS === "web" ? 300 : 200, // Taller for desktop web
    paddingTop: 50, // For status bar
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 40,
    color: "#FFFFFF",
    letterSpacing: 15,
  },
});