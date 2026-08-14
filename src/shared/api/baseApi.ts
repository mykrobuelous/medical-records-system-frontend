import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '../data/api.types';
import type { IDBrand } from '../utils/idUtils';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Patient', 'Consultation'],
    endpoints: () => ({}),
});

// Standard "list" tag pattern: tags each item by id plus a LIST tag, so
// creating/updating/deleting an item can invalidate the right queries.
export const providesList = <T extends { id: IDBrand }, TagType extends string>(
    result: ApiResponse<T[]> | undefined,
    tagType: TagType
) =>
    result && result.status === 'ok'
        ? [
              ...result.data.map(({ id }) => ({ type: tagType, id }) as const),
              { type: tagType, id: 'LIST' as const },
          ]
        : [{ type: tagType, id: 'LIST' as const }];
