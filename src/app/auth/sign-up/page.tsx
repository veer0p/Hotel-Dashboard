'use client';

import React from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join PMS Pro and start managing your property efficiently."
        >
            <SignUpForm />

            <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                    href="/auth"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                    Sign In
                </Link>
            </div>
        </AuthLayout>
    );
}
