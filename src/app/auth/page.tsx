'use client';

import React from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Mail } from 'lucide-react';
import { SignInForm } from '@/components/auth/SignInForm';
import { SocialLogins } from '@/components/auth/SocialLogins';

export default function AuthPage() {
    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your dashboard to manage your hotel."
        >
            <SignInForm />

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            or continue with
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <SocialLogins />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col space-y-4 text-center text-sm">
                <Link
                    href="/auth/magic-link"
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Mail size={18} /> Send Magic Link
                </Link>
                <div className="flex justify-between items-center px-2">
                    <Link
                        href="/auth/forgot-password"
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Forgot your password?
                    </Link>
                    <Link
                        href="/auth/sign-up"
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
