import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import type { MyPageProps } from "@/types/index.d.ts";
import { useState, useEffect } from "react";
import axios from "axios";


interface CustomProps {
    totalRequests: number;
    totalVerifications: number;
    pendingRequests: number;
    approvedToday: number;
    declinedToday: number;
    completedRequests: number;
} 

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { 
        auth : { user }, 
        totalRequests, 
        totalVerifications, 
        pendingRequests, 
        approvedToday, 
        declinedToday,
        completedRequests,
    } = usePage<MyPageProps & CustomProps>().props;

    const [data, setData] = useState<CustomProps>({
        totalRequests, 
        totalVerifications, 
        pendingRequests, 
        approvedToday, 
        declinedToday,
        completedRequests,
    });


    useEffect(() => {
      const interval = setInterval(() => {
        axios.get('/poll/dashboard-data').then(response => {
            console.log(response.data);
            setData(response.data);
        });
      }, (5000));
    
      return () => {
        clearInterval(interval);
      }
    }, [])
    



    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
    
                <main className="w-full p-4 pb-8">
                    <div>
                        <p className="text-4xl">Hello, { user.name }</p>
                        
                        {user.is_admin ? (
                            <p className="text-foreground/40 mt-1 text-lg">Administrator</p>
                        ) : null}

                        {!user.is_admin ?
                        (
                            user.verified_at ? (
                                <p className="text-foreground/40 mt-1 text-lg">Verified User</p>
                            ) : (
                                <p className="text-foreground/40 mt-1 text-lg">Unverified User</p>
                            )
                        ) : null}
                    </div>
    
                    { user.is_admin ?
                        <div className="w-full mt-8 space-y-4">
                            <div className="w-full space-x-4 space-y-4">
                                <div className="w-full flex flex-wrap gap-4">
                                    
                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[200px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Total Requests</p>
                                            <p className="text-4xl font-semibold text-primary">{data.totalRequests}</p> {/* replace with {totalRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">All-time submitted requests</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[200px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Pending Account Verifications</p>
                                            <p className="text-4xl font-semibold text-green-600">{data.totalVerifications}</p> {/* replace with {pendingVerifications} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Accounts waiting for verification</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[200px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Waiting  Requests</p>
                                            <p className="text-4xl font-semibold text-green-600">{data.pendingRequests}</p> {/* replace with {pendingRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Document requests waiting for approval</p>
                                    </div>
                                </div>
                                <div className="w-full flex flex-wrap gap-4">
                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[200px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Approved Today</p>
                                            <p className="text-4xl font-semibold text-blue-400">{data.approvedToday}</p> {/* replace with {pendingRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Document requests approved today</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[200px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Declined Today</p>
                                            <p className="text-4xl font-semibold text-red-700">{data.declinedToday}</p> {/* replace with {pendingRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Document requests declined today</p>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    } 

                    { (!user.is_admin && user.verified_at != null) ? (
                        <div className="w-full mt-8 space-y-4">
                            <div className="w-full space-x-4 space-y-4">
                                <div className="w-full flex flex-wrap gap-4">
                                    
                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[200px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Your Total Requests</p>
                                            <p className="text-4xl font-semibold text-primary">{data.totalRequests}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Your all-time submitted requests</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[200px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Completed Requests</p>
                                            <p className="text-4xl font-semibold text-green-600">{data.completedRequests}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Completed requests that you made</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[200px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Pending Requests</p>
                                            <p className="text-4xl font-semibold text-red-700">{data.pendingRequests}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Document requests not yet approved</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}


                    

                </main>
    
            </AppLayout>
        </>
    );
}
