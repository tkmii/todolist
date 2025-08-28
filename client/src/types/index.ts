import type { AxiosRequestConfig } from 'axios'; // для AxiosBaseQueryArg

// авторизация
export interface User {
  id: number;
  username: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// список задач
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type FilterType = 'all' | 'active' | 'completed';

// redux. state
export interface RootState {
  auth: AuthState;
}

export interface ReduxApi {
  getState: () => { auth: AuthState };
  dispatch: (action: { type: string; payload?: unknown }) => void;
}

// API, HTTP
export interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

export interface BaseQueryError {
  status?: number;
  data?: unknown;
}

export interface ApiErrorLogin {
  data?: {
    error: string;
  };
  status?: number;
}

export interface ApiErrorRegister {
  data?: string;
}

export interface QueueItem {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}

// пропсы
export interface AuthFormProps {
  mode: 'login' | 'register';
}

export interface TodoFormProps {
  value: string;
  onValueChange: (value: string) => void;
  addItem: (e: React.FormEvent) => void;
  isAdding?: boolean;
}

export interface TodoItemProps {
  todo: Todo;
}

export interface TodoListProps {
  todos: Todo[];
}

export interface FilterTabsProps {
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
}

export interface FilterItemProps {
  state: FilterType;
  text: string;
  isActive: boolean;
  onFilterChange: (filter: FilterType) => void;
}

export interface ErrorText {
  text: string;
}