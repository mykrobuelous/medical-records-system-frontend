import type { LoginSchemaType } from '../../../features/LoginPage/schema/loginSchema';
import type { ApiResponse } from '../../data/api.types';
import { baseApi } from '../baseApi';

export const loginApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        loginUser: builder.mutation<ApiResponse<string>, LoginSchemaType>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginUserMutation } = loginApi;
