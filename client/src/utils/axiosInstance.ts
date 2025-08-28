import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type { RefreshTokenResponse, AuthState, QueueItem } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface CreateAxiosInstanceParams {
  getState: () => { auth: AuthState };
  dispatch: (action: { type: string; payload?: unknown }) => void;
}

export const createAxiosInstance = ({
  getState,
  dispatch
}: CreateAxiosInstanceParams): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL,
  });

  let isRefreshing = false;
  let failedQueue: QueueItem[] = [];

  const processQueue = (error: unknown, token: string | null = null): void => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    failedQueue = [];
  };

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const state = getState();
      const token = state.auth.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axiosInstance(originalRequest));
              },
              reject: (err) => reject(err),
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const state = getState();
          const refreshToken = state.auth.refreshToken;

          if (!refreshToken) {
            dispatch({ type: 'auth/clearCredentials' });
            return Promise.reject(error);
          }

          const response = await axios.post<RefreshTokenResponse>(
            `${baseURL}/api/auth/refresh`,
            { refreshToken }
          );

          dispatch({ 
            type: 'auth/setCredentials', 
            payload: response.data 
          });

          processQueue(null, response.data.accessToken);

          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          dispatch({ type: 'auth/clearCredentials' });
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};