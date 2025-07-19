import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps } from "@inertiajs/core";
import { format, formatDistance } from "date-fns";
import type { User } from "@/types/index.d.ts";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];


type MyType = {
    auth: {
        user: User
    },
    registeredUsers: {
        data: User[],
        links: any,
        [key: string]: unknown
    }
}

export default function Users() {
    const { registeredUsers } = usePage<PageProps & MyType>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verify Account" />

            <main className="w-full p-4">
                { registeredUsers.data.length > 0 ? (
                    <>
                        <div className="w-full flex flex-col gap-2 md:h-[360px]">
                            {
                                registeredUsers.data.map((user) => (
                                    <Link href={`#`}>
                                        <div className="cursor-pointer w-full bg-primary/5 border-primary/15 rounded border flex p-4 items-center justify-between">
                                            <p className="md:text-lg w-[180px]">{user.name}</p>
                                            <p className="text-foreground/50 text-sm hidden md:block">{formatDistance(new Date(user.created_at), new Date())}</p>
                                            <p className="text-sm md:text-base">{format(user.created_at, "MMMM d, yyyy")}</p>
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                        
                        <div className="flex gap-1 mt-8 flex-wrap">
                            {
                                registeredUsers.links.map((link: any) => (
                                    <Link href={link.url}>
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
                            <h1 className="text-3xl text-foreground/50 text-center mt-40">No Registered User</h1>
                        </div>
                    </>
                    )
                }
            </main>
        </AppLayout>
    );
}
