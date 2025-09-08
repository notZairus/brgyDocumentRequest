import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps } from "@inertiajs/core";
import { format, formatDistance } from "date-fns";
import type { User, Pagination, Penalty, Appeal } from "@/types/index.d.ts";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { replacePaginationLink } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appeals',
        href: '/appeals',
    },
];





type MyType = {
    auth: {
        user: User
    },
    appeals: {
        data: Appeal[],
        links: any,
        [key: string]: unknown
    }
}




export default function index() {
    const { appeals: paginationData } = usePage<PageProps & MyType>().props;
    const [pagination, setPagination] = useState<Pagination<Appeal>>(paginationData);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         axios.get('/poll/unverified-accounts').then(response => {
    //             const newPagination = replacePaginationLink<User>(response.data.pagination, "/poll/unverified-accounts", "/verify-accounts");
    //             console.log(newPagination);
    //             setPagination(newPagination);
    //         })
    //     }, 10000);

    //     return () => clearInterval(interval);
    // }, [])

    console.log(pagination.data);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verify Account" />

            <main className="w-full p-4">
                { pagination.data.length > 0 ? (
                    <>
                        <ul className="w-full flex flex-col gap-2 md:h-[360px]">
                            {
                                pagination.data.map((appeal) => (
                                    <Link key={appeal.id} href={`/appeals/${appeal.id}`}>
                                        <li className="cursor-pointer w-full bg-primary/5 border-primary/15 rounded border flex p-4 items-center justify-between">
                                            <p className="md:text-lg w-[260px]">ID: {appeal.id} <span className="ml-8">{appeal.user.name}</span></p>
                                            <p className="text-foreground/50 text-sm hidden md:block">{formatDistance(new Date(appeal.created_at), new Date())}</p>
                                            <p className="text-sm md:text-base">{format(appeal.created_at, "MMMM d, yyyy")}</p>
                                        </li>
                                    </Link>
                                ))
                            }
                        </ul>
                        
                        <div className="flex gap-1 mt-8 flex-wrap">
                            {
                                pagination.links.map((link: any) => (
                                    <Link href={link.url} key={link.label} >
                                        <Button 
                                            variant={link.active ? "secondary" : "outline"}
                                            disabled={link.url ? false : true}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </Link>
                                ))
                            }
                        </div>
                    </>
                    ) : (
                    <>
                        <div className="w-full">
                            <h1 className="text-3xl text-foreground/50 text-center mt-40">No Appeal Found</h1>
                        </div>
                    </>
                    )
                }
            </main>
        </AppLayout>
    );
}
