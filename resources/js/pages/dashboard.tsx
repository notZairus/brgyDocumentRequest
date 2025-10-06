import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import type { MyPageProps } from "@/types/index.d.ts";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react";
import { Separator } from '@/components/ui/separator';



interface CustomProps {
    totalRequests: number;
    verifiedUsers: number;
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
        verifiedUsers,
        totalVerifications, 
        pendingRequests, 
        approvedToday, 
        declinedToday,
        completedRequests,
    } = usePage<MyPageProps & CustomProps>().props;

    const [openFrom, setOpenFrom] = useState(false);
    const [from, setFrom] = useState<Date | undefined>(undefined);
    const [openTo, setOpenTo] = useState(false);
    const [to, setTo] = useState<Date | undefined>(undefined);
    const [filtered, setFiltered] = useState(false);

    const [data, setData] = useState<CustomProps>({
        totalRequests, 
        verifiedUsers,
        totalVerifications, 
        pendingRequests, 
        approvedToday, 
        declinedToday,
        completedRequests,
    });

    function fetchRecentData() {
        axios.get('/poll/dashboard-data').then(response => {
            console.log(response.data);
            setData(response.data);
        });
    }


    useEffect(() => {
        if (filtered) return;

        const interval = setInterval(() => {
            fetchRecentData();
        }, (5000));
        
        return () => {
            clearInterval(interval);
        }
    }, [filtered])

    function applyDateFilter() {
        if (!from || !to) {
            toast.error("Please select both 'from' and 'to' dates.");
            return;
        }

        if (from > to) {
            toast.error("'From' date cannot be later than 'to' date.");
            return;
        }

        if (from > new Date()) {
            toast.error("'From' date cannot be in the future.");
            return;
        }


        axios.post('/dashboard/filter', {
            from: from.toISOString().split('T')[0],
            to: to.toISOString().split('T')[0],
        }).then(response => {
            setFiltered(true);
            setData(response.data);
            toast.success("Date filter applied.");
        }).catch(error => {
            toast.error("Failed to apply date filter.");
        });
    }
    



    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
    
                <main className="w-full p-4 pb-8">
                    <div>
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

                        <Separator className="my-4" />

                        { user.is_admin ? 
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="mt-4 flex flex-col md:flex-row item-center flex-wrap gap-4 md:gap-8">
                                <div>
                                    <Label htmlFor="date" className="px-1">
                                        From: 
                                    </Label>
                                    <Popover open={openFrom} onOpenChange={setOpenFrom}>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-full md:w-48 justify-between font-normal"
                                        >
                                            {from ? from.toLocaleDateString() : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={from}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setFrom(date)
                                                setOpenFrom(false)
                                            }}
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
    
                                <div>
                                    <Label htmlFor="date" className="px-1">
                                        To: 
                                    </Label>
                                    <Popover open={openTo} onOpenChange={setOpenTo}>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-full md:w-48 justify-between font-normal"
                                        >
                                            {to ? to.toLocaleDateString() : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={to}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setTo(date)
                                                setOpenTo(false)
                                            }}
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
    
                                <Button onClick={applyDateFilter}>Apply</Button>
                            </div>

                            <Button
                                variant="outline"
                                disabled={!filtered}
                                onClick={() => {
                                    setFrom(undefined);
                                    setTo(undefined);
                                    setFiltered(false);
                                    fetchRecentData();
                                    toast.success("Date filter removed.");
                                }}
                            >
                                Remove Filters
                            </Button>
                        </div> : null}


                    </div>
    
                    { user.is_admin ?
                        <div className="w-full mt-8 space-y-4">
                            <div className="w-full space-x-4 space-y-4">

                                <div className="w-full flex flex-wrap gap-4">

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[300px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Total Requests</p>
                                            <p className="text-4xl font-semibold text-primary">{data.totalRequests}</p> {/* replace with {totalRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">All-time submitted requests</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[300px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Verified User</p>
                                            <p className="text-4xl font-semibold text-primary">{data.verifiedUsers}</p> {/* replace with {totalRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">All-time verified users</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[300px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Completed Requests</p>
                                            <p className="text-4xl font-semibold text-primary">{data.completedRequests}</p> {/* replace with {totalRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">All-time completed requests</p>
                                    </div>


                                    {/* Other data */}
                                </div>

                                <Separator />

                                <div className="w-full flex flex-wrap gap-4">
                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[300px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Pending Account Verifications</p>
                                            <p className="text-4xl font-semibold text-green-600">{data.totalVerifications}</p> {/* replace with {pendingVerifications} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Accounts waiting for verification</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[300px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Pending Requests</p>
                                            <p className="text-4xl font-semibold text-green-600">{data.pendingRequests}</p> {/* replace with {pendingRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Document requests waiting for approval</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="w-full flex flex-wrap gap-4">
                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[300px] h-32 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-muted-foreground">Approved Today</p>
                                            <p className="text-4xl font-semibold text-blue-400">{data.approvedToday}</p> {/* replace with {pendingRequests} */}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Document requests approved today</p>
                                    </div>

                                    <div className="flex-1 border border-primary/15 bg-primary/5 rounded-xl min-w-[300px] h-32 p-4 flex flex-col justify-between">
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
                        <>
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
                        </>
                    ) : null}

                    { (!user.is_admin && user.verified_at === null) ? (
                        <>
                            <div className="mx-auto p-4 mt-8 space-y-4 bg-primary/5 border border-primary/10 rounded">
                                <h1 className='md:text-3xl text-2xl'>
                                    Wait for Admin to Verify Your Account
                                </h1>
                                <p className='md:text-xl text-md'>
                                  Thank you for registering! Your account is currently under review. An administrator will verify your details shortly. You'll receive a notification once your account has been approved.
Please allow up to 24 hours for verification.
                                </p>
                            </div>
                        </>
                    ) : null}


                    

                </main>
    
            </AppLayout>
        </>
    );
}
