// components/TodoFilters.tsx
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
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    // On mobile, this will be stacked below the list
    // On desktop, it's part of the footer (handled by styling)
  },
  text: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 14,
  },
});