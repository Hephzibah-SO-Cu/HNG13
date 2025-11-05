// components/TodoFilters.tsx
// [MODIFIED]
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type Filter = "all" | "active" | "completed";
type Props = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export default function TodoFilters({ filter, setFilter }: Props) {
  const { colors } = useTheme();

  return (
    // 1. Wrap in a card-style View
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity onPress={() => setFilter("all")}>
        <Text
          style={[
            styles.text,
            filter === "all"
              ? { color: colors.primary }
              : { color: colors.textSecondary },
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilter("active")}>
        <Text
          style={[
            styles.text,
            filter === "active"
              ? { color: colors.primary }
              : { color: colors.textSecondary },
          ]}
        >
          Active
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilter("completed")}>
        <Text
          style={[
            styles.text,
            filter === "completed"
              ? { color: colors.primary }
              : { color: colors.textSecondary },
          ]}
        >
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // 2. Apply card styling
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  text: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 14,
  },
});