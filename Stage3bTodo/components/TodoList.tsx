// components/TodoList.tsx
// [MODIFIED]
// Fixing component paths
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
// --- FIX: Use correct path alias ---
import TodoItem from "@/components/TodoItem";
import TodoFooter from "@/components/TodoFooter";
import TodoFilters from "@/components/TodoFilters";
// --- END FIX ---
import { useState } from "react";

type Filter = "all" | "active" | "completed";

export default function TodoList({ todos }: { todos: Doc<"todos">[] }) {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<Filter>("all");
  const updateOrder = useMutation(api.todos.updateOrder);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.isCompleted;
    if (filter === "completed") return todo.isCompleted;
    return true;
  });

  const onDragEnd = ({ data }: { data: Doc<"todos">[] }) => {
    // We only update the order for the "all" filter to avoid confusion
    if (filter === "all") {
      const updatedOrder = data.map((item, index) => ({
        _id: item._id,
        order: index + 1,
      }));
      updateOrder({ todos: updatedOrder });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <DraggableFlatList
        data={filteredTodos}
        keyExtractor={(item) => item._id}
        onDragEnd={onDragEnd}
        renderItem={({ item, drag, isActive }) => (
          <ScaleDecorator>
            <TodoItem todo={item} onDrag={drag} isActive={isActive} />
          </ScaleDecorator>
        )}
        ListFooterComponent={
          <TodoFooter
            count={todos.filter((t) => !t.isCompleted).length}
          />
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
      />
      <TodoFilters filter={filter} setFilter={setFilter} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    overflow: "hidden", // Clips the list items
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  separator: {
    height: 1,
    width: "100%",
  },
});