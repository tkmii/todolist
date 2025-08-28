import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../api/authApi';
import { setCredentials } from '../store/authSlice';
import type { AuthFormProps, ApiErrorRegister, ApiErrorLogin } from '../types/index';
import type { AppDispatch } from '../store';
import { Link } from 'react-router-dom';
import Error from './Error';

export default function AuthForm({ mode }: AuthFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();
  const [register, { isLoading: isRegisterLoading, error: registerError }] =
    useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let result;
      if (mode === 'login') {
        result = await login({ username, password }).unwrap();
      } else {
        result = await register({ username, password }).unwrap();
      }
      dispatch(setCredentials(result));
    } catch (err) {
      console.error('Auth failed:', err);
    }
  };
  
  const errorText = loginError 
    ? (loginError as ApiErrorLogin).data?.error 
    : registerError 
      ? (registerError as ApiErrorRegister).data
      : undefined;

  const isLoading = isLoginLoading || isRegisterLoading;
  const isLoginMode = mode === 'login';

  return (
    <div className="w-full md:w-1/2 px-4 md:px-0 mx-auto mt-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mb-6"
      >
        <h1 className="text-2xl text-center font-semibold">
          {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
        </h1>

        <input
          type="text"
          placeholder="Введите имя пользователя"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Введите пароль"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          className="text-lg text-white rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 transition bg duration-300 ease-in-out self-center py-2 px-4 cursor-pointer w-full md:w-[fit-content]"
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
        </button>

      </form>

      <p className="text-gray-500 md:text-center mb-2">
        {isLoginMode ? (
          <>Нет аккаунта? <Link className="font-semibold underline transition opacity duration-300 ease-in-out hover:opacity-50" to="/register">Зарегистрироваться</Link></>
        ) : (
          <>Уже зарегистрированы? <Link className="font-semibold underline transition opacity duration-300 ease-in-out hover:opacity-50" to="/login">Войти</Link></>
        )}
      </p>

      {errorText && (
        <div className="md:text-center">
          <Error text={errorText} />
        </div>
      )}
    </div>
  );
}