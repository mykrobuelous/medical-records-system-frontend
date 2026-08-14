export type ApiResponse<T> =
    | { status: 'ok'; data: T; message?: string }
    | { status: 'error'; message: string; errors?: unknown };
