import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import type { MyPageProps, DocumentRequest } from "@/types/index.d.ts";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef } from "react"
import { Flag, Printer, Bell } from "lucide-react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import EditDocumentDialog from '@/components/edit-document-modal';



interface CustomPageProps {
    documentRequest: DocumentRequest,
    activityLog: any,
    flash: {
        success: string,
        error: string
    }
}



/**
 * Page for showing a document request.
 * 
 * This page shows the details of a document request.
 * 
 * If the user is an admin, the page also has a form for the admin to approve or decline the request.
 * 
 * @returns The page element.
 */
export default function show() {
    const { documentRequest, hasPenalty, auth: { user }, activityLog } = usePage<MyPageProps & CustomPageProps>().props;
    const [showDeclineReason, setShowDeclineReason] = useState(false);
    const { data, setData, put } = useForm({
        action: '',
        reason: '',
    });
    const [penaltyReason, setPenaltyReason] = useState(documentRequest.status === 'Ready for Pickup' ? "User doesn't show up to get the document." : "Troll request.");
    const origName = useRef<string>(documentRequest.document_details?.name || "");

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
    

    const handlePut = () => {
        put(`/document-requests/${documentRequest.id}`, {
            preserveScroll: true
        });
    } 

    return (
        <>  
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Document Requests" />
    
                <main className="w-full p-4">
    
                    <div className="pb-8">
                        <div className="flex justify-between items-center gap-8 pr-4">
                            <div className="flex items-center justify-between w-full">
                                <h1 className="text-xl font-bold">
                                    Document Request 
                                    <span className="text-blue-400">{` #${documentRequest.id}`}</span>
                                    <span className="ml-8">{`( ${format(documentRequest.created_at, "MMMM d, yyyy")} )`}</span>
                                </h1>
                                { !user.is_admin && (
                                    <p className="font-bold text-2xl">{documentRequest.status}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">

                                {
                                    documentRequest.status === "Ready for Pickup" && (
                                        <Link method="post" href={`/notify-user/${documentRequest.id}`} preserveScroll>
                                            <Button variant="outline" size="lg" >
                                                <Bell />
                                                Notify User
                                            </Button>
                                        </Link>
                                    )
                                }


                                { user.is_admin && documentRequest.user_id !== user.id && !hasPenalty && (documentRequest.status === "Approved" || documentRequest.status === "Ready for Pickup") ? (
                                    <a href={`/download-docx/${documentRequest.id}`} rel="noopener noreferer">
                                        <Button size="lg">
                                            <Printer />
                                            Print
                                        </Button>
                                    </a>
                                ) : null}

                                { user.is_admin && documentRequest.user_id !== user.id && !hasPenalty && documentRequest.status !== "Approved" && documentRequest.status !== "Completed"  ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="lg">
                                                <Flag />
                                                Report
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Penalize User</DialogTitle>
                                                <DialogDescription>
                                                    Please provide a reason for penalizing this user.  
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4">
                                                <div className="grid gap-3">
                                                    <Label htmlFor="name-1">Reason</Label>
                                                    <Textarea 
                                                        defaultValue={penaltyReason} 
                                                        onChange={(e) => setPenaltyReason(e.target.value)} 
                                                        required 
                                                        minLength={10} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Link preserveScroll href={`/penalties`} method="post" data={{ document_request_id: documentRequest.id, user_id: documentRequest.user_id, reason: penaltyReason }}>
                                                        <Button className="w-full">Report</Button>
                                                    </Link>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : null}
                            </div>

                        </div>
        
                        <Separator className="my-4" />
        
                        <div className="space-y-2">
                            <p>Requested By: <span className="text-lg font-medium">{documentRequest.user?.name} ( {documentRequest.user?.email} )</span></p>
                            <p>Requested On: <span className="text-lg font-medium">{format(documentRequest.created_at, "MMMM d, yyyy")}</span></p>
                            <p>Contact Number: <span className="text-lg font-medium">{documentRequest.user?.number}</span></p>

                            <div className="w-full flex-1 p-2 mt-8 bg-primary/5 border border-primary/15 max-w-2/3">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold mb-2">Document Details</p>

                                    { documentRequest.status !== 'Completed' && documentRequest.user_id === user.id && (
                                        <EditDocumentDialog />
                                    )}
                                    
                                    
                                </div>
                                <div className="space-y-1">
                                    <p>Document Type: <span className="text-lg font-medium">{documentRequest.document_type}</span></p>
                                    {   documentRequest.document_details && Object.entries(documentRequest.document_details).map(([key, value]) => {
                                        if (value) {
                                            return <p>{key.replace("_", " ")[0].toUpperCase() + key.replace("_", " ").slice(1)}: <span className="text-lg font-medium">{value as string}</span></p>
                                        }
                                    })}

                                    {documentRequest.notes && <p className="mt-4">Additional Notes: <span className="text-lg font-medium">{documentRequest.notes}</span></p>}
                                </div>
                            </div>

                        </div>
        
                        <div className="mt-8">
                            <p>Valid ID:</p>
                            <div className="mt-2 flex gap-4 rounded flex-wrap lg:max-w-3xl">
                                <div className="w-full flex-1 p-2 bg-primary/5 border border-primary/15 min-w-11/12 lg:min-w-auto">
                                    <img 
                                        src={documentRequest.user?.name === origName.current 
                                            ? `/getId/${documentRequest.user?.id}/front`
                                            : `/getOtherId/${documentRequest.id}/front`
                                        } 
                                        alt="front id" 
                                        className="object-fit w-full h-full"
                                    />
                                </div>
                                <div className="w-full flex-1 p-2 bg-primary/5 border border-primary/15 min-w-11/12 lg:min-w-auto">
                                    <img 
                                        src={documentRequest.user?.name === origName.current 
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
                                                    <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Approving this request will mark it as "Approved", notify the requester, and allow staff to prepare or print the document. This action is final and cannot be undone. If you need to modify the document details, do so before confirming.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handlePut}>Continue</AlertDialogAction>
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
                                        <div>
                                            
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {[
                                                    'Incomplete requirements',
                                                    'Suspicious request',
                                                    'Duplicate request',
                                                    'Invalid ID provided',
                                                    'Missing informations',
                                                    'Invalid informations',
                                                    "User didn't respond",
                                                ].map((reason) => (
                                                    <div
                                                        key={reason}
                                                        onClick={() => setData('reason', reason)}
                                                        className={`px-3 py-1 rounded-md cursor-pointer text-sm border transition-colors ${
                                                            data.reason === reason
                                                                ? 'bg-primary/20 border-primary'
                                                                : 'bg-primary/5 border-primary/15'
                                                        } hover:opacity-90`}
                                                    >
                                                        {reason}
                                                    </div>
                                                ))}
                                            </div>


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
                                                            Confirm
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirm Decline</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                You are about to decline this document request. The requester will be notified and the reason you provide will be saved to the activity log. This action cannot be undone.
                                                            </AlertDialogDescription>
                                                            {data.reason && (
                                                                <div className="mt-2 text-sm">
                                                                    <strong>Reason provided:</strong> <span className="italic">{data.reason}</span>
                                                                </div>
                                                            )}
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handlePut}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
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
                                                    <AlertDialogTitle>Confirm: Mark as Ready for Pickup</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Marking this request as "Ready for Pickup" will notify the requester and allow staff to prepare the document for collection. This action is final and cannot be undone — please verify that all document details are correct before continuing.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handlePut}>Continue</AlertDialogAction>
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
                                                    <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Mark this request as "Completed" to record that the document has been handed over and notify the requester — this action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handlePut}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        
                                    </div>
                                </div>
                            </>
                        ) : null}

                        { documentRequest.status === "Declined" ?(
                            <>
                                <Separator className="my-6" />

                                <div>
                                    <div className="p-4 bg-red-400/15 border border-primary/15 rounded wfull max-w-2/3">
                                        <h2 className="text-lg font-bold mb-2">Reason for Decline</h2>
                                        <p>{activityLog?.reason ?? 'Reported'}</p>
                                    </div>
                                </div>
                            </>
                        ) : null } 
                    </div>
                </main>
            </AppLayout>
        </>
    )
}
