import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';
import type { User, MyPageProps } from "@/types/index.d.ts";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";


interface CustomPageProps {
    user: User,
}



export default function VerifyAccounts() {
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

    function handleApprove() {
        patch(`/verify-accounts/${user.id}`);
    }

    function handleDecline() {
        destroy(`/verify-accounts/${user.id}`);
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verify Account" />

            <main className="w-full p-4">
                <div className="w-full pb-20 md:pb-0 flex flex-col-reverse md:flex-row items-start gap-8 md:max-w-3xl mx-auto">

                    <div className="flex-1 w-full">
                        <div className="p-4 bg-primary/5 rounded border-primary/15 border">
                            <h1 className="font-bold text-xl">Details</h1>
                            <div className="mt-4 space-y-2">
                                <p className="text-foreground/50">Name: <br /> <span className="text-lg text-foreground">{user.name}</span></p>
                                <p className="text-foreground/50">Sitio: <br /> <span className="text-lg text-foreground">{user.sitio}</span></p>
                                <p className="text-foreground/50">Email: <br /> <span className="text-lg text-foreground">{user.email}</span></p>
                                <p className="text-foreground/50">Contact Number: <br /> <span className="text-lg text-foreground">{user.number}</span></p>
                                <p className="text-foreground/50">Requested at: <br /> <span className="text-lg text-foreground">{format(user.updated_at, 'EEEE, MMMM d • h:mm a')  }</span></p>
                            </div>
                        </div>
                        <div className="w-full mt-8 flex gap-2">
                            <Button className="flex-1 cursor-pointer" size="lg" variant="default" onClick={handleApprove}>
                                Approve
                            </Button>
                            <Button className="flex-1 cursor-pointer" size="lg" variant="secondary" onClick={handleDecline}>
                                Decline
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 w-full">
                        <div className="w-full aspect-video flex-1 p-2 bg-primary/5 border border-primary/15">
                            <p>Brgy. ID Front</p>
                            <img src={`/getId/${user.id}/front`} alt="front id" className="rounded border" />
                        </div>
                        <div className="w-full aspect-video flex-1 p-2 bg-primary/5 border border-primary/15">
                            <p>Brgy. ID Back</p>
                            <img src={`/getId/${user.id}/back`} alt="back id" className="rounded border" />
                        </div>
                        <div className="w-full aspect-video flex-1 p-2 bg-primary/5 border border-primary/15">
                            <p>Selfie of a user:</p>
                            <img src={`/getId/${user.id}/selfie`} alt="selfie" className="rounded border" />
                        </div>
                    </div>

                </div>
            </main>
        </AppLayout>
    );
}
