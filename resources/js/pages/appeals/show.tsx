import React from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import type { Appeal, MyPageProps } from "@/types/index.d.ts";
import AppLayout from '@/layouts/app-layout';
import { format } from "date-fns";

interface CustomPageProps {
    appeal: Appeal,
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appeals',
        href: '/appeals',
    },
    {
        title: 'Appeal Details',
        href: ''
    }
];



export default function show() {
    const { auth, appeal } = usePage<MyPageProps & CustomPageProps>().props;

    console.log(appeal);
        
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verify Account" />

            <main className="w-full p-4">
                <h1 className="text-3xl font-bold">{appeal.reason}</h1>
                <p className="text-sm text-muted-foreground">{format(new Date(appeal.created_at), "MMMM d, yyyy")}</p>
            </main>
                
        </AppLayout>
    )
}
