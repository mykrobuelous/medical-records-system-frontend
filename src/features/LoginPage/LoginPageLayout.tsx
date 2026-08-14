// 📦 LIBRARIES IMPORT
import { twMerge } from 'tailwind-merge';
import Input from '../../shared/components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginSchemaType } from './schema/loginSchema';
import { useLoginUserMutation } from '../../shared/api/endpoints/loginEndpoint';
import { useState } from 'react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router';
import Button from '../../shared/components/Button';
import type { ApiResponse } from '../../shared/data/api.types';

const getErrorMessage = (error: FetchBaseQueryError | SerializedError): string => {
    if ('data' in error) {
        const data = error.data as ApiResponse<string> | undefined;

        if (data?.status === 'error') {
            return data.message;
        }
    }

    return 'An error occurred. Please try again.';
};

/* ===================================================================== */
/* 🧩 LOGIN PAGE LAYOUT - Where the doctor will login */

interface Props {
    className?: string;
}

const LoginPageLayout: React.FC<Props> = ({ className }) => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });

    const [loginUser] = useLoginUserMutation();

    const onSubmit = async (credentials: LoginSchemaType) => {
        try {
            const response = await loginUser(credentials).unwrap();

            if (response.status === 'error') {
                setErrorMessage(response.message);
                return;
            }

            setErrorMessage(null);

            localStorage.setItem('token', response.data);

            navigate('/');
        } catch (error) {
            setErrorMessage(getErrorMessage(error as FetchBaseQueryError | SerializedError));
        }
    };

    console.log('Vite URL', import.meta.env.VITE_API_URL);

    return (
        <div
            className={twMerge(
                'flex min-h-screen items-center justify-center bg-linear-to-br from-blue-700 via-blue-600 to-blue-800 px-4',
                className
            )}
        >
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                        <span className="text-xl font-semibold text-blue-700">M</span>
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                        Medical Records
                    </h1>

                    <p className="mt-2 text-sm text-blue-100">
                        Sign in to continue to your account
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="rounded-2xl border border-blue-100 bg-white p-6 shadow-xl"
                >
                    <div className="space-y-4">
                        <Input
                            label="Username"
                            placeholder="Enter your username"
                            {...register('username')}
                            error={errors.username?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password')}
                            error={errors.password?.message}
                        />
                    </div>

                    {errorMessage && <p className="mt-4 text-sm text-red-500">{errorMessage}</p>}

                    <Button label="Sign In" className="mt-6 w-full" />
                </form>

                <p className="mt-5 text-center text-xs text-blue-100">
                    Secure Medical Records System
                </p>
            </div>
        </div>
    );
};

export default LoginPageLayout;
