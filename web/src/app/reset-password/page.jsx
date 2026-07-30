'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import { ResetPasswordPage } from '@/components/auth/reset-password-page';
import { useRouter } from 'next/navigation';
export default function ResetPasswordRoute() {
    const router = useRouter();
    return (<ResetPasswordPage onSuccess={() => router.push('/')} onCancel={() => router.push('/')}/>);
}
