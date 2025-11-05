// app/(tabs)/index.tsx
// [MODIFIED]
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
// 1. Import from react-native-safe-area-context
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TodoScreen() {
  const { colors } = useTheme();
  const todos = useQuery(api.todos.get);

  return (
    // 2. This SafeAreaView is now the correct one
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header />

      {todos === undefined ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          <TodoInput />
          <TodoList todos={todos} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});