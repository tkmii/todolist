import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../utils/axiosBaseQuery';
import type { AuthResponse, AuthCredentials } from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthCredentials>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, AuthCredentials>({
      query: (credentials) => ({
        url: '/api/auth/register',
        method: 'POST',
        data: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;