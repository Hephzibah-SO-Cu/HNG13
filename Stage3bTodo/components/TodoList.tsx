// components/TodoList.tsx
// [MODIFIED]
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import TodoItem from "@/components/TodoItem";
import TodoFooter from "@/components/TodoFooter";
// 1. Remove TodoFilters import
import { useState } from "react";

type Filter = "all" | "active" | "completed";

// 2. Accept `filter` as a prop
export default function TodoList({
  todos,
  filter,
}: {
  todos: Doc<"todos">[];
  filter: Filter;
}) {
  const { colors } = useTheme();
  // 3. Remove local filter state
  const updateOrder = useMutation(api.todos.updateOrder);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.isCompleted;
    if (filter === "completed") return todo.isCompleted;
    return true;
  });

  const onDragEnd = ({ data }: { data: Doc<"todos">[] }) => {
    if (filter === "all") {
      const updatedOrder = data.map((item, index) => ({
        _id: item._id,
        order: index + 1,
      }));
      updateOrder({ todos: updatedOrder });
    }
  };

  return (
    // 4. Remove `overflow: 'hidden'` to see shadows properly
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
        // 5. Add content container style for padding
        contentContainerStyle={styles.listContent}
      />
      {/* 6. REMOVE TodoFilters from here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    // Add margin bottom so it doesn't touch the new filter card
    marginBottom: 20,
  },
  // 7. Add list content style for padding inside
  listContent: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: "hidden", // Clip items inside
  },
  separator: {
    height: 1,
    width: "100%",
  },
});