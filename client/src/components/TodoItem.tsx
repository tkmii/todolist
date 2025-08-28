import { type TodoItemProps } from "../types";
import { useUpdateTodoMutation, useDeleteTodoMutation } from "../api/todosApi";

function TodoItem({ todo }: TodoItemProps) {
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  const handleToggle = async () => {
    try {
      await updateTodo({ 
        id: todo.id, 
        completed: !todo.completed 
      }).unwrap();
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id).unwrap();
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const isDisabled = isUpdating || isDeleting;

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isDisabled}
        className="w-5 h-5 cursor-pointer shrink"
      />
      <span className={`
        flex-1 
        ${todo.completed 
          ? 'line-through text-gray-600' 
          : 'no-underline text-gray-900'
        }
      `}>
        {todo.title}
      </span>
      <button
        onClick={handleDelete}
        disabled={isDisabled}
        className="text-base py-2 px-4 rounded-full border-2 border-indigo-600 cursor-pointer transition opacity duration-300 ease-in-out hover:opacity-50"
      >
        {isDeleting ? 'Удаление...' : 'Удалить'}
      </button>
    </div>
  );
}

export default TodoItem;