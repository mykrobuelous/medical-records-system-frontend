import type { DiagnosisType } from '../../data/data.types';
import type { ApiResponse } from '../../data/api.types';
import type { IDBrand } from '../../utils/idUtils';
import { baseApi, providesList } from '../baseApi';

export type CreateDiagnosisPayload = Omit<DiagnosisType, 'id'>;

export type UpdateDiagnosisPayload = {
    id: IDBrand;
    data: Partial<CreateDiagnosisPayload>;
};

export const diagnosisApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDiagnoses: builder.query<ApiResponse<DiagnosisType[]>, void>({
            query: () => ({
                url: '/diagnoses',
                method: 'GET',
            }),
            providesTags: (result) => providesList(result, 'Diagnosis'),
        }),
        createDiagnosis: builder.mutation<ApiResponse<DiagnosisType>, CreateDiagnosisPayload>({
            query: (body) => ({
                url: '/diagnoses',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Diagnosis', id: 'LIST' }],
        }),
        updateDiagnosis: builder.mutation<ApiResponse<DiagnosisType>, UpdateDiagnosisPayload>({
            query: ({ id, data }) => ({
                url: `/diagnoses/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Diagnosis', id },
                { type: 'Diagnosis', id: 'LIST' },
            ],
        }),
        deleteDiagnosis: builder.mutation<ApiResponse<null>, IDBrand>({
            query: (id) => ({
                url: `/diagnoses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Diagnosis', id },
                { type: 'Diagnosis', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetDiagnosesQuery,
    useCreateDiagnosisMutation,
    useUpdateDiagnosisMutation,
    useDeleteDiagnosisMutation,
} = diagnosisApi;
