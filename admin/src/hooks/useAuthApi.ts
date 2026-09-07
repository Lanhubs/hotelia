import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Api from '../lib/api';

export interface LoginPayload {
  email: string;
  password?: string;
  role?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export function useAuthApi() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await Api.post<{ token: string; user: UserResponse }>('/admin/auth/login', payload);
      if (res?.token) {
        Api.setToken(res.token);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await Api.post('/admin/auth/logout');
      Api.clearToken();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!Api.getToken()) return null;
      return Api.get<UserResponse>('/admin/auth/me');
    },
    enabled: !!Api.getToken(),
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    currentUser: currentUserQuery.data,
    isLoadingUser: currentUserQuery.isLoading,
  };
}
