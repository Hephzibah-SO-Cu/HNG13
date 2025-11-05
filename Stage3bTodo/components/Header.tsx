// components/Header.tsx
// [MODIFIED]
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
import { LinearGradient } from "expo-linear-gradient"; // 1. Import LinearGradient

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
      {/* 2. Add the Gradient Overlay */}
      <LinearGradient
        // Use the consistent key we just defined in Colors.ts
        colors={colors.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientOverlay} // 25% opacity
      />
      {/* 3. Container now sits on top of the gradient */}
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
    height: Platform.OS === "web" ? 300 : 200,
    paddingTop: 50,
  },
  // 4. Add styles for the overlay
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.75, // 25% opacity as requested
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "relative", // Ensure it's on top of the overlay
    zIndex: 1,
  },
  title: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 40,
    color: "#FFFFFF",
    letterSpacing: 15,
  },
});