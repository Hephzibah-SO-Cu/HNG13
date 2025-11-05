// components/TodoInput.tsx
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TodoInput() {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const addTodo = useMutation(api.todos.add);

  const handleAddTodo = () => {
    if (text.trim().length > 0) {
      addTodo({ text: text.trim() });
      setText("");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View
        style={[styles.circle, { borderColor: colors.border }]}
      />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder="Create a new todo..."
        placeholderTextColor={colors.textSecondary}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAddTodo} // Add on "Enter"
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: -20, // Pulls it up into the header
    marginBottom: 20,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 18,
  },
});