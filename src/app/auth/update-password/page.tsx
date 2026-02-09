'use client';

import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';

export default function UpdatePasswordPage() {
    return (
        <AuthLayout
            title="Set New Password"
            subtitle="Please enter your new password below."
        >
            <UpdatePasswordForm />
        </AuthLayout>
    );
}
