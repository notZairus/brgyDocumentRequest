import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import type { DocumentRequest } from "@/types/index.d.ts";
import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Requests',
        href: '/document-requests',
    },
];

type UsePageProps = {
    documentRequests: DocumentRequest[]
}

export default function index() {
    const { documentRequests } = usePage<UsePageProps>().props;
    const [data] = useState<DocumentRequest[]>([...documentRequests]);

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Document Requests" />
    
                <main className="w-full p-4">
                    <DataTable columns={columns} data={data} />
                </main>
    
            </AppLayout>
        </>
    );
}

