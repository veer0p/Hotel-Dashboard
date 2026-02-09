import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, CheckCircle2, Timer } from 'lucide-react';

const signUpSchema = z.z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignUpValues = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [countdown, setCountdown] = useState<number>(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpValues) => {
        if (countdown > 0) return;

        setIsLoading(true);
        setError(null);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) throw signUpError;
            setIsSuccess(true);
        } catch (err: any) {
            const isRateLimit = err.message?.toLowerCase().includes('rate limit') || err.status === 429;
            if (isRateLimit) {
                setCountdown(60);
                setError(`Rate limit exceeded. Please try again in 60 seconds.`);
            } else {
                setError(err.message || 'An error occurred during sign up');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-4">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-600">
                    We've sent a verification link to your email address. Please verify your account to continue.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className={`p-3 border rounded-lg text-sm flex gap-3 ${countdown > 0 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-600'
                    }`}>
                    {countdown > 0 ? <Timer className="h-5 w-5 shrink-0" /> : null}
                    <div>
                        {countdown > 0
                            ? `Rate limit exceeded. You can try again in ${countdown} seconds.`
                            : error
                        }
                    </div>
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
                    disabled={countdown > 0}
                    className={`block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
                        } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-950 text-gray-900 dark:text-white dark:placeholder-slate-500 disabled:bg-gray-50 dark:disabled:bg-slate-900 disabled:text-gray-500 dark:disabled:text-slate-500`}
                    placeholder="john@example.com"
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            disabled={countdown > 0}
                            className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
                                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-950 text-gray-900 dark:text-white dark:placeholder-slate-500 disabled:bg-gray-50 dark:disabled:bg-slate-900 disabled:text-gray-500 dark:disabled:text-slate-500`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={countdown > 0}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Confirm Password
                    </label>
                    <input
                        {...register('confirmPassword')}
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        disabled={countdown > 0}
                        className={`block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
                            } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-950 text-gray-900 dark:text-white dark:placeholder-slate-500 disabled:bg-gray-50 dark:disabled:bg-slate-900 disabled:text-gray-500 dark:disabled:text-slate-500`}
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        {...register('terms')}
                        id="terms"
                        type="checkbox"
                        disabled={countdown > 0}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded disabled:opacity-50 dark:bg-slate-900"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600 dark:text-slate-400">
                        I agree to the <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Privacy Policy</a>
                    </label>
                    {errors.terms && (
                        <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || countdown > 0}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Creating Account...
                    </>
                ) : countdown > 0 ? (
                    `Wait ${countdown}s`
                ) : (
                    'Create Account'
                )}
            </button>
        </form>
    );
};
