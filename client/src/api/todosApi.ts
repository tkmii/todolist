import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../utils/axiosBaseQuery';
import type { Todo } from '../types/index';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => ({
        url: '/api/todos',
        method: 'GET',
      }),
      providesTags: ['Todo'],
    }),
    addTodo: builder.mutation<Todo, { title: string }>({
      query: (body) => ({
        url: '/api/todos',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation<Todo, { id: number; completed: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/api/todos/${id}`,
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;