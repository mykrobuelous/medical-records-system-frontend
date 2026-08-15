import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { ApiResponse } from '../data/api.types';

// Pulls the backend's own error message out of a failed RTK Query mutation,
// falling back to a generic message when the response isn't the expected ApiResponse shape.
export const getApiErrorMessage = (
    error: FetchBaseQueryError | SerializedError,
    fallback = 'An error occurred. Please try again.'
): string => {
    if ('data' in error) {
        const data = error.data as ApiResponse<unknown> | undefined;

        if (data?.status === 'error') {
            return data.message;
        }
    }

    return fallback;
};
