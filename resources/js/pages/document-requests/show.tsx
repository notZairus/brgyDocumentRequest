import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';
import type { MyPageProps, DocumentRequest } from "@/types/index.d.ts";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"


interface CustomPageProps {
    documentRequest: DocumentRequest
}


export default function show() {
    const { documentRequest } = usePage<MyPageProps & CustomPageProps>().props;
    const [showDeclineReason, setShowDeclineReason] = useState(false);
    const { data, setData, patch } = useForm({
        action: '',
        reason: '',
    });

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

    const handleApprove = () => {
        patch(`/document-requests/${documentRequest.id}`, {
            preserveScroll: true
        });
    }

    const handleDecline = () => {
        patch(`/document-requests/${documentRequest.id}`, {
            preserveScroll: true
        });
    }


    return (
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
                        <p>Document Type: <span className="text-lg font-medium">{documentRequest.document_type}</span></p>
                        <p>Requested On: <span className="text-lg font-medium">{format(documentRequest.created_at, "MMMM d, yyyy")}</span></p>
                        <p>Purpose: <span className="text-lg font-medium">{documentRequest.purpose}</span></p>
                        {documentRequest.notes && <p>Additional Notes: <span className="text-lg font-medium">{documentRequest.notes}</span></p>}
                    </div>
    
                    <div className="mt-8">
                        <p>Valid ID:</p>
                        <div className=" mt-2 flex gap-4 rounded flex-wrap lg:max-w-3xl">
                            <div className="flex-1 bg-white/20 min-w-[200px] overflow-hidden rounded">
                                <img src={`/getId/${documentRequest.user?.id}/front`} alt="front id" />
                            </div>
                            <div className="flex-1 bg-white/20 min-w-[200px] overflow-hidden rounded">
                                <img src={`/getId/${documentRequest.user?.id}/back`} alt="front id" />
                            </div>
                        </div>
                    </div>
    
                    

                    { documentRequest.status === "Pending" || documentRequest.status === "Under Review" && 
                        <>
                            <Separator className="my-6" />
                            <div className="sm:p-4 border rounded-xl shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button 
                                        onClick={() => {
                                            setData('action', 'Approved');
                                            handleApprove();
                                        }} 
                                        variant="default"
                                        size="lg"
                                    >
                                        Approve Request
                                    </Button>
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
                                        <Button onClick={handleDecline} variant="default">
                                            Submit Decline
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    }
                    
                </div>
            </main>
        </AppLayout>
    )
}
