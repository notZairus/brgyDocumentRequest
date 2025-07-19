import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps } from "@inertiajs/core";
import type { User } from "@/types/index.d.ts";


type MyType = {
    auth: {
        user: User
    },
    user: User,
}

export default function Users() {
    const { user } = usePage<PageProps & MyType>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Users',
            href: '/users',
        },
        {
            title: user.name,
            href: `/users/${user.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verify Account" />

            <main className="w-full p-4">
                <p>{JSON.stringify(user)}</p>
            </main>
        </AppLayout>
    );
}
