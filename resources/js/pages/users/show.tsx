import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import type { User, MyPageProps } from "@/types/index.d.ts";
import { format } from "date-fns";

interface CustomPageProps {
    user: User,
}

export default function Users() {
    const { auth, user } = usePage<MyPageProps & CustomPageProps>().props;
    const { patch, delete: destroy } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Verify Accounts',
            href: '/verify-accounts',
        },
        {
            title: user.name,
            href: `/verify-accounts/${user.id}`
        }
    ];

    console.log(user);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verify Account" />

            <main className="w-full p-4 pb-12">
                <div className="w-full pb-20 md:pb-0 flex flex-col items-start gap-8 md:max-w-3xl mx-auto">

                    <div className="flex-1 flex gap-4 w-full flex-wrap">
                        <div className="w-full aspect-video flex-1 p-2 bg-primary/5 border border-primary/15 min-w-11/12 sm:min-w-auto">
                            <img src={`/getId/${user.id}/front`} alt="front id" className="rounded border" />
                        </div>
                        <div className="w-full aspect-video flex-1 p-2 bg-primary/5 border border-primary/15 min-w-11/12 sm:min-w-auto">
                            <img src={`/getId/${user.id}/back`} alt="front id" className="rounded border" />
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="p-4 bg-primary/5 rounded border-primary/15 border">
                            <h1 className="font-bold text-xl">Details</h1>
                            <div className="mt-4 space-y-2">
                                <p className="text-foreground/50">Name: <br /> <span className="text-lg text-foreground">{user.name}</span></p>
                                <p className="text-foreground/50">Email: <br /> <span className="text-lg text-foreground">{user.email}</span></p>
                                <p className="text-foreground/50">Requested at: <br /> <span className="text-lg text-foreground">{format(user.updated_at, 'EEEE, MMMM d • h:mm a')  }</span></p>
                            </div>
                        </div>
                    </div>

                    {   user.penalties.length > 0 &&
                        <div className="flex-1 w-full bg-red-400/15 rounded border-primary/15 border min-h-20 p-4" >
                            <h1 className="font-bold text-xl mb-4">Penalties</h1>
                            <ul>
                                {user.penalties.map((penalty) => (
                                    <li key={penalty.id} className="cursor-pointer p-4 hover:bg-primary/10 rounded border-b-1 border-primary/15" >
                                        <Link href={`/document-requests/${penalty.document_request_id}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">Document ID:</span>
                                                <span>{penalty.document_request_id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">Reason:</span>
                                                <span>{penalty.reason}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            </main>
        </AppLayout>
    );
}
