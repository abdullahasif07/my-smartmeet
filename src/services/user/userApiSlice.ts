import {
    fetchBaseQuery,
    createApi,
    BaseQueryApi,
    FetchArgs,
} from '@reduxjs/toolkit/query/react'

import { BaseResponse, UserResponse } from '@/types/response.type'
import { LoginUserRequest, RegisterUserRequest } from '@/types/request.type'

import { USERS_URL } from '@/constants'
import { clearAuth } from '@/features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: USERS_URL,
    prepareHeaders: (headers) => {
        return headers
    },
    credentials: 'include',
})

async function baseQueryWithAuth(
    args: string | FetchArgs,
    api: BaseQueryApi,
    extra: object
) {
    const result = await baseQuery(args, api, extra)
    // Dispatch the logout action on 401.
    if (result.error && result.error.status === 401) {
        api.dispatch(clearAuth())
    }
    return result
}

export const userApiSlice = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        signup: builder.mutation<UserResponse, RegisterUserRequest>({
            query: (body) => ({
                url: '/register',
                method: 'POST',
                body,
            }),
        }),
        signin: builder.mutation<UserResponse, LoginUserRequest>({
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
    }),
})

export const {
    useSignupMutation,
    useSigninMutation,
    useSignoutMutation,
    useProfileQuery,
} = userApiSlice
