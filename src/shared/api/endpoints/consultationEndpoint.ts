import type { ConsultationType } from '../../data/data.types';
import type { ApiResponse } from '../../data/api.types';
import type { IDBrand } from '../../utils/idUtils';
import { baseApi, providesList } from '../baseApi';

export type CreateConsultationPayload = Omit<ConsultationType, 'id' | 'createdAt'>;

export type UpdateConsultationPayload = {
    id: IDBrand;
    data: Partial<Omit<CreateConsultationPayload, 'patientId'>>;
};

export const consultationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getConsultations: builder.query<ApiResponse<ConsultationType[]>, void>({
            query: () => ({
                url: '/consultations',
                method: 'GET',
            }),
            providesTags: (result) => providesList(result, 'Consultation'),
        }),
        getConsultationsByPatientId: builder.query<ApiResponse<ConsultationType[]>, IDBrand>({
            query: (patientId) => ({
                url: `/consultations/patient/${patientId}`,
                method: 'GET',
            }),
            providesTags: (result) => providesList(result, 'Consultation'),
        }),
        getConsultationById: builder.query<ApiResponse<ConsultationType>, IDBrand>({
            query: (id) => ({
                url: `/consultations/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Consultation', id }],
        }),
        createConsultation: builder.mutation<
            ApiResponse<ConsultationType>,
            CreateConsultationPayload
        >({
            query: (body) => ({
                url: '/consultations',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Consultation', id: 'LIST' }],
        }),
        updateConsultation: builder.mutation<
            ApiResponse<ConsultationType>,
            UpdateConsultationPayload
        >({
            query: ({ id, data }) => ({
                url: `/consultations/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Consultation', id },
                { type: 'Consultation', id: 'LIST' },
            ],
        }),
        deleteConsultation: builder.mutation<ApiResponse<null>, IDBrand>({
            query: (id) => ({
                url: `/consultations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Consultation', id },
                { type: 'Consultation', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetConsultationsQuery,
    useGetConsultationsByPatientIdQuery,
    useGetConsultationByIdQuery,
    useCreateConsultationMutation,
    useUpdateConsultationMutation,
    useDeleteConsultationMutation,
} = consultationApi;
