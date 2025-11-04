import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, ImageBackground } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { Swipeable } from "react-native-gesture-handler";

import { useThemeContext } from "../lib/ThemeContext";
import TodoItem from "../components/TodoItem";
import TodoInput from "../components/TodoInput";
import mockTodos from "../lib/mockTodos";
import { Todo } from "../lib/types";

const Page = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(p) => p.theme.colors.background};
`;


const Header = styled.View`
  height: 160px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const HeaderBackground = styled(ImageBackground)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Title = styled.Text`
  font-family: ${(p) => p.theme.fonts.heading as string};
  font-size: ${(p) => p.theme.sizes.h1}px;
  letter-spacing: 15px;
  color: ${(p) => p.theme.colors.text as string};
`;

const Content = styled.View`
  flex: 1;
  align-items: center;
  padding: 18px;
`;

const Card = styled.View`
  width: 92%;
  background-color: ${(p) => p.theme.colors.panel};
  border-radius: 10px;
  padding: 12px;
  elevation: 6;
`;

const FooterTabs = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 12px;
  width: 92%;
`;

const TabText = styled.Text`
  color: ${(p) => p.theme.colors.muted};
`;

export default function HomeScreen(): JSX.Element {
  const theme = useTheme();
  const { toggle } = useThemeContext();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");

  useEffect(() => {
    setTodos(mockTodos());
  }, []);

  function onDragEnd({ data }: { data: Todo[] }) {
    setTodos(data.map((t, i) => ({ ...t, position: i })));
    // TODO: persist order positions to Convex
  }

  async function toggleComplete(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    // TODO: call Convex update
  }

  async function onDelete(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    // TODO: call Convex delete
  }

  async function addTodo(payload: { title: string }) {
    const newTodo: Todo = {
      id: `local-${Date.now()}`,
      title: payload.title,
      completed: false,
      position: 0,
      createdAt: new Date().toISOString(),
    };
    setTodos((p) => [newTodo, ...p]);
    // TODO: create via Convex
  }

  const filtered = todos.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Active") return !t.completed;
    return t.completed;
  });

  return (
    <Page>
      <Header>
        <HeaderBackground source={require("../assets/images/header_light.png")} resizeMode="cover">
          {/* overlay handled inside image if you exported gradient mask */}
        </HeaderBackground>
        <Title>T O D O</Title>
        <TouchableOpacity onPress={toggle} style={{ position: "absolute", right: 20, top: 20 }}>
          <Ionicons name="moon" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </Header>

      <Content>
        <Card>
          <TodoInput onSubmit={addTodo} placeholder="Create a new todo..." />

          <DraggableFlatList
            data={filtered}
            onDragEnd={onDragEnd}
            keyExtractor={(item) => item.id}
            renderItem={({ item, drag }: RenderItemParams<Todo>) => (
              <Swipeable
                renderRightActions={() => (
                  <TouchableOpacity onPress={() => onDelete(item.id)} style={{ backgroundColor: "#FF5252", justifyContent: "center", padding: 16 }}>
                    <Ionicons name="trash" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              >
                <TodoItem todo={item} onToggle={() => toggleComplete(item.id)} onLongPress={drag} />
              </Swipeable>
            )}
          />

          <FooterTabs>
            <TouchableOpacity onPress={() => setFilter("All")}>
              <TabText style={{ color: filter === "All" ? theme.colors.primary : undefined }}>All</TabText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilter("Active")}>
              <TabText style={{ color: filter === "Active" ? theme.colors.primary : undefined }}>Active</TabText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilter("Completed")}>
              <TabText style={{ color: filter === "Completed" ? theme.colors.primary : undefined }}>Completed</TabText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTodos((p) => p.filter((t) => !t.completed))}>
              <TabText>Clear Completed</TabText>
            </TouchableOpacity>
          </FooterTabs>
        </Card>
      </Content>
    </Page>
  );
}
