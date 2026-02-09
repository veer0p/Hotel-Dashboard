'use client';

import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';

export default function MagicLinkPage() {
    return (
        <AuthLayout
            title="Sign in with Link"
            subtitle="We'll send a magic link to your inbox for instant access."
        >
            <MagicLinkForm />
        </AuthLayout>
    );
}
