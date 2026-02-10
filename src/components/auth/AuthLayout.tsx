'use client';

import React from 'react';
import Link from 'next/link';

import { Hotel } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div id="main-content" className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="sm:mx-auto sm:w-full sm:max-width-md">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tight flex items-center justify-center gap-2">
                        <Hotel className="w-8 h-8" /> PMS Pro
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                        Modern Hotel Management
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-gray-100 dark:border-slate-800 sm:rounded-2xl sm:px-10 transition-colors duration-200">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                            {subtitle && <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">{subtitle}</p>}
                        </div>

                        {children}

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-500 underline underline-offset-4 decoration-blue-200 dark:decoration-blue-900/50">
                                        Secure Connection
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
