// components/TodoItem.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LinearGradient } from "expo-linear-gradient";
import CheckIcon from "@/assets/icons/CheckIcon"; // We will create this
import CrossIcon from "@/assets/icons/CrossIcon"; // We will create this

type Props = {
  todo: Doc<"todos">;
  onDrag: () => void;
  isActive: boolean;
};

export default function TodoItem({ todo, onDrag, isActive }: Props) {
  const { colors } = useTheme();
  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.remove);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card },
        isActive && styles.shadow,
      ]}
    >
      <TouchableOpacity
        onPress={() => toggleTodo({ id: todo._id })}
        style={styles.checkboxContainer}
      >
        {todo.isCompleted ? (
          <LinearGradient colors={colors.gradient} style={styles.circle}>
            <CheckIcon />
          </LinearGradient>
        ) : (
          <View
            style={[styles.circle, { borderColor: colors.border }]}
          />
        )}
      </TouchableOpacity>

      <Text
        style={[
          styles.text,
          { color: todo.isCompleted ? colors.completed : colors.text },
          todo.isCompleted && styles.strikethrough,
        ]}
        onLongPress={onDrag}
      >
        {todo.text}
      </Text>

      <TouchableOpacity
        onPress={() => removeTodo({ id: todo._id })}
        style={styles.crossButton}
      >
        <CrossIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    flex: 1,
    fontFamily: "JosefinSans_400Regular",
    fontSize: 18,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  crossButton: {
    marginLeft: 12,
    padding: 5,
  },
});