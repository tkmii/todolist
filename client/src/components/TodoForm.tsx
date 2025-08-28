import type { TodoFormProps } from "../types";

function TodoForm({ value, onValueChange, addItem, isAdding }: TodoFormProps) {
  
  return (
    <form onSubmit={addItem} className="mb-6 flex w-full gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="Введите новую задачу..."
        disabled={isAdding}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button 
        type="submit" 
        disabled={isAdding}
        className="text-white rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 transition bg duration-300 ease-in-out self-center py-2 px-4 cursor-pointer w-[fit-content]"
      >
        Добавить
      </button>
    </form>
  );
}

export default TodoForm;