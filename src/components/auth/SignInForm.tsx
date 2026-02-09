'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const signInSchema = z.z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInValues = z.infer<typeof signInSchema>;

export const SignInForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (signInError) throw signInError;

            // Redirect will be handled by AuthContext change or manually if needed
        } catch (err: any) {
            setError(err.message || 'An error occurred during sign in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Email Address
                </label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    autoComplete="email"
                    className={`block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
                        } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-950 text-gray-900 dark:text-white dark:placeholder-slate-500`}
                    placeholder="john@example.com"
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Password
                </label>
                <div className="relative">
                    <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
                            } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-950 text-gray-900 dark:text-white dark:placeholder-slate-500`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
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
                        Signing In...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>
        </form>
    );
};
