// components/TodoInput.tsx
import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const Input = styled.TextInput`
  flex: 1;
  height: 42px;
  background-color: ${(p) => (p.theme.colors.panel as string)};
  border-radius: 8px;
  padding: 8px 12px;
  font-family: ${(p) => p.theme.fonts.body as string};
  font-size: ${(p) => p.theme.sizes.body}px;
  color: ${(p) => p.theme.colors.text as string};
  border: 1px solid ${(p) => p.theme.colors.border as string};
`;

type Props = {
  placeholder?: string;
  onSubmit: (payload: { title: string }) => Promise<void> | void;
};

export default function TodoInput({ onSubmit, placeholder = "Create a new todo..." }: Props) {
  const [value, setValue] = useState("");

  async function submit() {
    if (!value.trim()) return;
    await onSubmit({ title: value.trim() });
    setValue("");
  }

  return (
    <Row>
      <Input
        placeholder={placeholder}
        placeholderTextColor="#B9B9C6"
        value={value}
        onChangeText={setValue}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <TouchableOpacity onPress={submit} style={{ marginLeft: 8 }}>
        <Ionicons name="add-circle" size={32} color="#3A7CFD" />
      </TouchableOpacity>
    </Row>
  );
}
