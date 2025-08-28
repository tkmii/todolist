import { useSelector } from 'react-redux';
import type { RootState } from '../types/index'

export const useAuth = () => {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  
  return {
    isAuthenticated: !!accessToken && !!user,
    user,
    accessToken,
    isTokenValid: accessToken ? !isTokenExpired(accessToken) : false,
  };
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};