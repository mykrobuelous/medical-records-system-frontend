import type { PatientType } from '../../data/data.types';
import type { ApiResponse } from '../../data/api.types';
import type { IDBrand } from '../../utils/idUtils';
import { baseApi, providesList } from '../baseApi';

export type CreatePatientPayload = Omit<PatientType, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePatientPayload = {
    id: IDBrand;
    data: Partial<CreatePatientPayload>;
};

export const patientApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPatients: builder.query<ApiResponse<PatientType[]>, void>({
            query: () => ({
                url: '/patients',
                method: 'GET',
            }),
            providesTags: (result) => providesList(result, 'Patient'),
        }),
        getPatientById: builder.query<ApiResponse<PatientType>, IDBrand>({
            query: (id) => ({
                url: `/patients/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
        }),
        createPatient: builder.mutation<ApiResponse<PatientType>, CreatePatientPayload>({
            query: (body) => ({
                url: '/patients',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
        }),
        updatePatient: builder.mutation<ApiResponse<PatientType>, UpdatePatientPayload>({
            query: ({ id, data }) => ({
                url: `/patients/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Patient', id },
                { type: 'Patient', id: 'LIST' },
            ],
        }),
        deletePatient: builder.mutation<ApiResponse<null>, IDBrand>({
            query: (id) => ({
                url: `/patients/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Patient', id },
                { type: 'Patient', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetPatientsQuery,
    useGetPatientByIdQuery,
    useCreatePatientMutation,
    useUpdatePatientMutation,
    useDeletePatientMutation,
} = patientApi;
