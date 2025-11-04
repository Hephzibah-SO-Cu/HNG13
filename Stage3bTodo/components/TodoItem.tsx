// components/TodoItem.tsx
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Todo } from "../lib/types";

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
`;

const Circle = styled.View<{ checked?: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2px;
  border-color: ${(p) => (p.checked ? (p.theme.colors.primary as string) : (p.theme.colors.border as string))};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const Title = styled.Text<{ completed?: boolean }>`
  flex: 1;
  font-family: ${(p) => p.theme.fonts.body as string};
  font-size: ${(p) => p.theme.sizes.body}px;
  color: ${(p) => (p.completed ? (p.theme.colors.muted as string) : (p.theme.colors.text as string))};
  text-decoration-line: ${(p) => (p.completed ? "line-through" : "none")};
`;

type Props = {
  todo: Todo;
  onToggle: () => void;
  onLongPress?: () => void;
};

export default function TodoItem({ todo, onToggle, onLongPress }: Props) {
  return (
    <TouchableOpacity onLongPress={onLongPress} onPress={onToggle} accessibilityLabel={`Todo: ${todo.title}`}>
      <Row>
        <Circle checked={todo.completed}>{todo.completed ? <SmallInner /> : null}</Circle>
        <Title completed={todo.completed}>{todo.title}</Title>
      </Row>
    </TouchableOpacity>
  );
}

const SmallInner = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #3A7CFD;
`;
