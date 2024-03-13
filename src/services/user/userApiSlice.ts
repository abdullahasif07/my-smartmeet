import {
  fetchBaseQuery,
  createApi,
  BaseQueryApi,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';

import {
  BaseResponse,
  UserResponse,
} from '@/types/response.type';
import {
  ChangePasswordRequest,
  LoginUserRequest,
  RegisterUserRequest,
  UpdateProfileRequest,
} from '@/types/request.type';

import { USERS_URL } from '@/constants';
import { clearAuth } from '@/features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: USERS_URL,
  prepareHeaders: (headers) => {
    return headers;
  },
  credentials: 'include',
});

async function baseQueryWithAuth(
  args: string | FetchArgs,
  api: BaseQueryApi,
  extra: object
) {
  const result = await baseQuery(args, api, extra);
  // Dispatch the logout action on 401.
  if (result.error && result.error.status === 401) {
    api.dispatch(clearAuth());
  }
  return result;
}

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    signup: builder.mutation<
      BaseResponse,
      RegisterUserRequest
    >({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),
    signin: builder.mutation<
      UserResponse,
      LoginUserRequest
    >({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    signout: builder.mutation<BaseResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    profile: builder.query<UserResponse, void>({
      query: () => '/profile',
    }),
    updateProfile: builder.mutation<
      UserResponse,
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: '/profile',
        method: 'PUT',
        body,
      }),
    }),
    changePassword: builder.mutation<
      BaseResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: '/password',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useSignoutMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApiSlice;
