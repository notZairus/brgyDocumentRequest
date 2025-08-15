import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import type { MyPageProps, DocumentRequest } from "@/types/index.d.ts";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



interface CustomPageProps {
    documentRequest: DocumentRequest
}


export default function show() {
    const { documentRequest, auth: { user } } = usePage<MyPageProps & CustomPageProps>().props;
    const [showDeclineReason, setShowDeclineReason] = useState(false);
    const { data, setData, patch } = useForm({
        action: '',
        reason: '',
    });

    console.log(documentRequest);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Document Requests',
            href: '/document-requests',
        },
        {
            title: `ID: ${documentRequest.id}`,
            href: `/document-requests/${documentRequest.id}`,
        }
    ];

    const handlePatch = () => {
        patch(`/document-requests/${documentRequest.id}`, {
            preserveScroll: true
        });
    } 


    return (
        <>  
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Document Requests" />
    
                <main className="w-full p-4">
    
                    <div className="pb-8">
                        <h1 className="text-xl font-bold">
                            Document Request 
                            <span className="text-blue-400">{` #${documentRequest.id}`}</span>
                            <span className="ml-8">{`( ${format(documentRequest.created_at, "MMMM d, yyyy")} )`}</span>
                        </h1>
        
                        <Separator className="my-4" />
        
                        <div className="space-y-2">
                            <p>Requested By: <span className="text-lg font-medium">{documentRequest.user?.name} ( {documentRequest.user?.email} )</span></p>
                            <p>Requested On: <span className="text-lg font-medium">{format(documentRequest.created_at, "MMMM d, yyyy")}</span></p>

                            <p className="mt-8">Name: <span className="text-lg font-medium">{documentRequest.name as string}</span></p>
                            <p>Document Type: <span className="text-lg font-medium">{documentRequest.document_type}</span></p>
                            <p>Purpose: <span className="text-lg font-medium">{documentRequest.purpose}</span></p>
                            {documentRequest.notes && <p>Additional Notes: <span className="text-lg font-medium">{documentRequest.notes}</span></p>}
                        </div>
        
                        <div className="mt-8">
                            <p>Valid ID:</p>
                            <div className=" mt-2 flex gap-4 rounded flex-wrap lg:max-w-3xl">
                                <div className="w-full flex-1 p-2 bg-primary/5 border border-primary/15">
                                    <img 
                                        src={documentRequest.user?.name === documentRequest.name 
                                            ? `/getId/${documentRequest.user?.id}/front`
                                            : `/getOtherId/${documentRequest.id}/front`
                                        } 
                                        alt="front id" 
                                        className="object-fit w-full h-full"
                                    />
                                </div>
                                <div className="w-full flex-1 p-2 bg-primary/5 border border-primary/15">
                                    <img 
                                        src={documentRequest.user?.name === documentRequest.name 
                                            ? `/getId/${documentRequest.user?.id}/back`
                                            : `/getOtherId/${documentRequest.id}/back`
                                        } 
                                        alt="front id" 
                                        className="object-fit w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
    
                        {user.is_admin && (documentRequest.status === "Pending" || documentRequest.status === "Under Review") ?
                            <>
                                <Separator className="my-6" />
                                <div className="sm:p-4 border rounded-xl shadow-sm space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                onClick={() => {
                                                    setData('action', 'Approved');
                                                    setData('reason', '');
                                                    setShowDeclineReason(false);
                                                }} 
                                                variant="default"
                                                size="lg"
                                                >
                                                    Approve Request
                                                </Button>

                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your account
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handlePatch}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Button 
                                            onClick={() => {
                                                setData('action', 'Declined');
                                                setShowDeclineReason(!showDeclineReason);
                                            }} 
                                            variant="secondary"
                                            size="lg"
                                        >
                                            Decline Request
                                        </Button>
                                    </div>
        
                                    {showDeclineReason && (
                                        <div className="space-y-4">
                                            <label className="text-sm font-medium">Reason for Decline:</label>
                                            <Textarea
                                                className="resize-none mt-1"
                                                placeholder="Enter your reason here..."
                                                value={data.reason}
                                                onChange={(e) => setData('reason', e.target.value)}
                                            />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button 
                                                        variant="default"
                                                        size="lg"
                                                    >
                                                        Ready For Pickup
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your account
                                                            and remove your data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handlePatch}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}
                                </div>
                            </> : null
                        }
    
                        {user.is_admin && documentRequest.status === "Approved" ? (
                            <>
                                <Separator className="my-6" />
                                <div className="sm:p-4 border rounded-xl shadow-sm space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4">

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                onClick={() => {
                                                    setData('action', 'Ready for Pickup');
                                                }} 
                                                variant="default"
                                                size="lg"
                                                >
                                                    Ready For Pickup
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handlePatch}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {user.is_admin && documentRequest.status === "Ready for Pickup" ? (
                            <>
                                <Separator className="my-6" />
                                <div className="sm:p-4 border rounded-xl shadow-sm space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4">

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                onClick={() => {
                                                    setData('action', 'Completed');
                                                }} 
                                                variant="default"
                                                size="lg"
                                                >
                                                    Completed
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handlePatch}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        
                                    </div>
                                </div>
                            </>
                        ) : null}
                        
                    </div>
                </main>
            </AppLayout>
        </>
    )
}
