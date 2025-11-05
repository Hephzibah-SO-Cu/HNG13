// app/(tabs)/index.tsx
// [MODIFIED]
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";
import TodoFilters from "@/components/TodoFilters"; // 1. Import TodoFilters
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react"; // 2. Import useState

type Filter = "all" | "active" | "completed";

export default function TodoScreen() {
  const { colors } = useTheme();
  const todos = useQuery(api.todos.get);
  const [filter, setFilter] = useState<Filter>("all"); // 3. Lift state up

  return (
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
          {/* 4. Pass todos and filter to TodoList */}
          <TodoList todos={todos} filter={filter} />
          {/* 5. Render TodoFilters separately */}
          <TodoFilters filter={filter} setFilter={setFilter} />
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