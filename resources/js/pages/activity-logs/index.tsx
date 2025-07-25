import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import type { ActivityLog } from "@/types/index.d.ts";
import { usePage } from "@inertiajs/react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity Logs',
        href: '/logs',
    },
];


type UsePageProps = {
    activityLogs: ActivityLog[]
}


export default function index() {
  const { activityLogs: data } = usePage<UsePageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Document Requests" />

        <main className="w-full p-4">
            <DataTable columns={columns} data={data} />
        </main>

    </AppLayout>
  )
}
