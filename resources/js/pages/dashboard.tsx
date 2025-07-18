import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from "@inertiajs/core";
import type { User } from "@/types/index.d.ts";



interface MyProps {
    auth: {
        user: User
    }
} 


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth : { user } } = usePage<PageProps & MyProps>().props;

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
    
                <main className="w-full min-h-dvh p-4">
                    <div>
                        <p className="text-4xl">Hello, { user.name }</p>
                        {user.is_admin ? (
                            <p className="text-foreground/40 mt-1 text-lg">Administrator</p>
                        ) : null}
                    </div>
    
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 auto-rows-[100px] mt-8">
                        <div className="col-span-full">
                            
                        </div>
                    </div>
                </main>
    
            </AppLayout>
        </>
    );
}
