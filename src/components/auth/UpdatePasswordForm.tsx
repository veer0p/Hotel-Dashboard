'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const updatePasswordSchema = z.z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export const UpdatePasswordForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdatePasswordValues>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const onSubmit = async (data: UpdatePasswordValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (updateError) throw updateError;
            setIsSuccess(true);

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/auth');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-4">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Password Updated</h3>
                <p className="text-gray-600">
                    Your password has been successfully updated. Redirecting you to sign in...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="password" title="New Password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                </label>
                <div className="relative">
                    <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                </label>
                <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="••••••••"
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Updating Password...
                    </>
                ) : (
                    'Update Password'
                )}
            </button>
        </form>
    );
};
