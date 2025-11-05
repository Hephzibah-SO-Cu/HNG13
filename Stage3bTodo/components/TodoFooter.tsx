// components/TodoFooter.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TodoFooter({ count }: { count: number }) {
  const { colors } = useTheme();
  const clearCompleted = useMutation(api.todos.clearCompleted);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {count} items left
      </Text>
      <TouchableOpacity onPress={() => clearCompleted({})}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Clear Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  text: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 14,
  },
});