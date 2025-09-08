import React from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import type { Appeal, MyPageProps } from "@/types/index.d.ts";
import AppLayout from '@/layouts/app-layout';
import { format } from "date-fns";
import { Button } from '@/components/ui/button';


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
                <div className="max-w-2xl mx-auto bg-primary/10 rounded-lg shadow p-8 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Appeal Details</h2>
                        <div>
                            <div className="mb-2">
                                <span className="font-semibold">Filed By:</span> {appeal.user?.name ?? 'Unknown'}
                            </div>
                            <div className="mb-2">
                                {/* <span className="font-semibold">Penalty:</span> {appeal.penalty?.description ?? 'N/A'} */}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Filed At:</span> {format(new Date(appeal.created_at), 'PPPp')}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Status:</span> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                    appeal.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : appeal.status === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-1">Appeal Reason</h3>
                        <div className="bg-primary/5 rounded p-4 text-foreground mt-2 text-lg ">
                            {appeal.reason}
                        </div>
                    </div>

                    {appeal.status === 'pending' && (
                        <div className="flex gap-4 justify-end">
                            <Link href={`/appeals/${appeal.id}`} method="patch" data={{ action: 'approved' }} preserveScroll >
                                <Button className="flex-1" size="lg">
                                    Approve
                                </Button>
                            </Link>
                            <Link href={`/appeals/${appeal.id}`} method="patch" data={{ action: 'rejected' }} preserveScroll >
                                <Button variant="destructive" className="flex-1" size="lg" >
                                    Reject
                                </Button>
                            </Link>
                        </div>
                    )}

                    {appeal.status !== 'pending' && (
                        <div className="text-center text-lg font-semibold text-gray-600">
                            This appeal has been {appeal.status}.
                        </div>
                    )}
                </div>
            </main>
                
        </AppLayout>
    )
}
