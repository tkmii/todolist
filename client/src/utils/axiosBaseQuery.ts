import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { createAxiosInstance } from './axiosInstance';
import type { BaseQueryError, AxiosBaseQueryArgs, ReduxApi } from '../types';

let axiosInstance: AxiosInstance | null = null;

export const axiosBaseQuery = (
  { baseUrl = '' }: { baseUrl?: string } = {}
): BaseQueryFn<AxiosBaseQueryArgs, unknown, BaseQueryError> => {
  return async ({ url, method, data, params, headers = {} }, api) => {
    const { getState, dispatch } = api as ReduxApi;

    if (!axiosInstance) {
      axiosInstance = createAxiosInstance({
        getState,
        dispatch
      });
    }

    try {
      const result: AxiosResponse = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      
      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? axiosError.message,
        },
      };
    }
  };
};