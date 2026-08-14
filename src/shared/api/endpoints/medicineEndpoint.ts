import type { MedicineType } from '../../data/data.types';
import type { ApiResponse } from '../../data/api.types';
import type { IDBrand } from '../../utils/idUtils';
import { baseApi, providesList } from '../baseApi';

export type CreateMedicinePayload = Omit<MedicineType, 'id'>;

export type UpdateMedicinePayload = {
    id: IDBrand;
    data: Partial<CreateMedicinePayload>;
};

export const medicineApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMedicines: builder.query<ApiResponse<MedicineType[]>, void>({
            query: () => ({
                url: '/medicines',
                method: 'GET',
            }),
            providesTags: (result) => providesList(result, 'Medicine'),
        }),
        createMedicine: builder.mutation<ApiResponse<MedicineType>, CreateMedicinePayload>({
            query: (body) => ({
                url: '/medicines',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Medicine', id: 'LIST' }],
        }),
        updateMedicine: builder.mutation<ApiResponse<MedicineType>, UpdateMedicinePayload>({
            query: ({ id, data }) => ({
                url: `/medicines/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Medicine', id },
                { type: 'Medicine', id: 'LIST' },
            ],
        }),
        deleteMedicine: builder.mutation<ApiResponse<null>, IDBrand>({
            query: (id) => ({
                url: `/medicines/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Medicine', id },
                { type: 'Medicine', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetMedicinesQuery,
    useCreateMedicineMutation,
    useUpdateMedicineMutation,
    useDeleteMedicineMutation,
} = medicineApi;
