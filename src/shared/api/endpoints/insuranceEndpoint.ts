import type { InsuranceType } from '../../data/data.types';
import type { ApiResponse } from '../../data/api.types';
import type { IDBrand } from '../../utils/idUtils';
import { baseApi, providesList } from '../baseApi';

export type CreateInsurancePayload = Omit<InsuranceType, 'id'>;

export type UpdateInsurancePayload = {
    id: IDBrand;
    data: Partial<CreateInsurancePayload>;
};

export const insuranceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getInsurances: builder.query<ApiResponse<InsuranceType[]>, void>({
            query: () => ({
                url: '/insurances',
                method: 'GET',
            }),
            providesTags: (result) => providesList(result, 'Insurance'),
        }),
        createInsurance: builder.mutation<ApiResponse<InsuranceType>, CreateInsurancePayload>({
            query: (body) => ({
                url: '/insurances',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Insurance', id: 'LIST' }],
        }),
        updateInsurance: builder.mutation<ApiResponse<InsuranceType>, UpdateInsurancePayload>({
            query: ({ id, data }) => ({
                url: `/insurances/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Insurance', id },
                { type: 'Insurance', id: 'LIST' },
            ],
        }),
        deleteInsurance: builder.mutation<ApiResponse<null>, IDBrand>({
            query: (id) => ({
                url: `/insurances/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Insurance', id },
                { type: 'Insurance', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetInsurancesQuery,
    useCreateInsuranceMutation,
    useUpdateInsuranceMutation,
    useDeleteInsuranceMutation,
} = insuranceApi;
