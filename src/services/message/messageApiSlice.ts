import {
  fetchBaseQuery,
  createApi,
  BaseQueryApi,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';

import { AskGPTResponse } from '@/types/response.type';
import { askGPTRequest } from '@/types/request.type';

import { MESSAGES_URL } from '@/constants';
import { clearAuth } from '@/features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: MESSAGES_URL,
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

export const messageApiSlice = createApi({
  reducerPath: 'messageApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    askGPT: builder.mutation<AskGPTResponse, askGPTRequest>(
      {
        query: (body) => ({
          url: '/askgpt',
          method: 'POST',
          body,
        }),
      }
    ),
  }),
});

export const { useAskGPTMutation } = messageApiSlice;
