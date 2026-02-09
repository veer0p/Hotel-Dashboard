import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, ArrowLeft, Timer } from 'lucide-react';
import Link from 'next/link';

const forgotPasswordSchema = z.z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm: React.FC = () => {
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
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        if (countdown > 0) return;

        setIsLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });

            if (resetError) throw resetError;
            setIsSuccess(true);
        } catch (err: any) {
            const isRateLimit = err.message?.toLowerCase().includes('rate limit') || err.status === 429;
            if (isRateLimit) {
                setCountdown(60); // Default to 60 seconds
                setError(`Rate limit exceeded. Please try again in 60 seconds.`);
            } else {
                setError(err.message || 'An error occurred. Please try again.');
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
                <p className="text-gray-600 mb-6">
                    We've sent password reset instructions to your email address.
                </p>
                <Link
                    href="/auth"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                </Link>
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
                    disabled={countdown > 0}
                    className={`block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
                        } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-950 text-gray-900 dark:text-white dark:placeholder-slate-500 disabled:bg-gray-50 dark:disabled:bg-slate-900 disabled:text-gray-500 dark:disabled:text-slate-500`}
                    placeholder="john@example.com"
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading || countdown > 0}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Sending Link...
                    </>
                ) : countdown > 0 ? (
                    `Wait ${countdown}s`
                ) : (
                    'Send Reset Link'
                )}
            </button>

            <div className="text-center">
                <Link
                    href="/auth"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                </Link>
            </div>
        </form>
    );
};
