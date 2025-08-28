import { useState, useCallback } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { useGetTodosQuery, useAddTodoMutation } from "../api/todosApi";
import Loading from "../components/Loading";
import Error from "../components/Error";
import FilterTabs from "../components/FilterTabs";
import type { FilterType } from "../types";

function Todos() {
  const [value, setValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  
  const { 
    data: todos = [], 
    isLoading, 
    error 
  } = useGetTodosQuery();
  
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Мемоизируем, т.к. передаётся в TodoForm
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      alert('Введите название задачи');
      return;
    }
    try {
      await addTodo({ title: trimmedValue }).unwrap();
      setValue('');
    } catch {
      alert('Failed to add todo')
    }
  }, [value, addTodo]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error text='Error loading todos' />;

  return (
    <div className="w-full md:w-1/2 px-4 md:px-0 mx-auto mt-4">
      <h1 className="text-2xl text-center font-semibold mb-4">Список задач</h1>
      
      <TodoForm 
        value={value} 
        onValueChange={setValue} 
        addItem={handleSubmit}
        isAdding={isAdding}
      />
      
      {todos.length > 0 && (
        <FilterTabs 
          currentFilter={filter}
          onFilterChange={handleFilterChange}
        />
      )}
      
      <TodoList todos={filteredTodos} />
    </div>
  );
}

export default Todos;