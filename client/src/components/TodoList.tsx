import { type TodoListProps } from "../types";
import TodoItem from "./TodoItem";

function TodoList({ todos }: TodoListProps ) {
  if (todos.length === 0) {
    return <div>Нет задач для отображения.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

export default TodoList;