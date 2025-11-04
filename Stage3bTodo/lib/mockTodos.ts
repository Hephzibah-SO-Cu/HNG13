// lib/mockTodos.ts
import { Todo } from "./types";

export default function mockTodos(): Todo[] {
  return [
    { id: "1", title: "Complete online JavaScript course", completed: false, position: 0 },
    { id: "2", title: "Jog around the park 3x", completed: false, position: 1 },
    { id: "3", title: "10 minutes meditation", completed: false, position: 2 },
    { id: "4", title: "Read for 1 hour", completed: false, position: 3 },
    { id: "5", title: "Pick up groceries", completed: false, position: 4 },
    { id: "6", title: "Complete Todo App on Frontend Mentor", completed: false, position: 5 },
  ];
}
