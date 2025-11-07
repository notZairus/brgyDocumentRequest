import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Webcam from "react-webcam";
import { Camera } from "lucide-react";
import { base64ToBlob } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { imgToBase64 } from '@/lib/utils';
// import { availableDocuments } from "@/datas";
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
import { usePage } from '@inertiajs/react';
import type { Document } from "@/types/index.d.ts"
import InputError from '@/components/input-error';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";




type IdType = {
    'base64': string,
    'file': File
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request Document',
        href: '/request-document',
    },
];

type useFormProps = {
    document_request_type: 'user' | 'other';
    document_type: string;
    note: string;
    price: string | number;
    purpose: string;
    other_purpose: string;
    selfie: null | IdType;
    [key: string]: any
}



/**
 * Page for requesting a document.
 * 
 * This page allows users to request for a document. It has a form that asks for the document type, purpose, notes, and preferred pickup date.
 * The form is validated and submitted to the backend.
 * 
 * The page also has a tabbed interface for requesting a document for the user or for others.
 * 
 * @returns The page element.
 */

export default function create() {
    const { available_documents } = usePage<Document[] & { [key: string ]: any }>().props;
    const [availableDocuments, setAvailableDocuments] = useState<Document[]>(
        available_documents.map((doc: Document) => ({
            ...doc,
            information: JSON.parse(doc.information as string)
        }))
    ); 

    const { data, setData, post, errors, setError, reset, clearErrors } = useForm<useFormProps>({
        document_request_type: 'user',
        document_type: '',
        price: '',
        note: '',
        purpose: '',
        other_purpose: '',
        selfie: null,
    });

    const [currentTab, setCurrentTab] = useState<string>('user');
    const brgyIdFrontRef = useRef(null);
    const brgyIdBackRef = useRef(null);
    const [shotTaken, setShotTaken] = useState<any>(null);
    const webcamRef = useRef<any>(null);


    const selectedDocumentType: Document | undefined = availableDocuments.find((doc: Document) => doc.type == data.document_type);

    const takeAShot = () => {
        if(!webcamRef.current) return;
        const shot = webcamRef.current.getScreenshot();
        setShotTaken(shot);
    }

    const confirmShot = () => {
        if (!shotTaken) {
            setError('selfie', 'Please take a selfie for verification.');
            return;
        }

        const blobb = base64ToBlob(shotTaken);

        const blobToFile = (blob: any, fileName = 'selfie.png') => {
            return new File([blob], fileName, { type: 'image/png' });
        };

        const file = blobToFile(blobb);

        setData('selfie', {
            base64: shotTaken,
            file: file
        });

        setShotTaken(null);
    }


    function setTab(tab: string) {
        setData('document_request_type', tab as 'other' | 'user');
        setCurrentTab(tab);
    }

    function submit() {
        clearErrors();

        if (currentTab === 'other') {
            
            if (!data['name'] || data['name'].trim().length <= 5) {
                setError('name', "Please enter your full name.")
                return;
            }

            if (! data['brgyIdFront'] || ! data['brgyIdBack']) {
                setError('brgyId', 'Upload your Barangay ID.')
                return;
            }

            if (! data['selfie']) {
                setError('selfie', 'Upload your verification selfie.')
                return;
            }
        }


        if (data['document_type'] === 'Certificate of Indigency') {            
            if (! data['purpose']) {
                setError('purpose', 'Purpose is required. Please select a purpose.');
                return;
            }

            if (! data['sitio'] && currentTab === 'other') {
                setError('sitio', 'Sitio is required. Please select a sitio.');
                return;
            }
        }

        if (data['document_type'] === 'Certificate of Residency') {            
            if (! data['civil_status']) {
                setError('civil_status', 'Civil Status is required. Please select a civil status.');
                return;
            }

            if (! data['sitio'] && currentTab === 'other') {
                setError('sitio', 'Sitio is required. Please select a sitio.');
                return;
            }
        }

        post("/document-requests", {
            onFinish: () => {
                reset();
                clearErrors();
            },
            preserveScroll: true
        });
    }

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Request a Document" />
    
                <main className="w-full p-4">
                    <div className="flex flex-col px-8 gap-8 md:flex-row">
                        <div className="flex-2">
                            <Tabs 
                                defaultValue="user" 
                                onValueChange={(value) => {
                                    reset();
                                    console.log(value);
                                    setTab(value);
                                }}
                            >
                                <TabsList className="w:md bg-primary/5 lg:w-md mx-auto border border-primary/15">
                                    <TabsTrigger value="user">For You</TabsTrigger>
                                    <TabsTrigger value="other">For Others</TabsTrigger>
                                </TabsList>
                                
                                <div className="max-w-xl w-full mx-auto space-y-4 my-8">
        
                                    <div className="flex flex-col gap-2">
                                        <Label>Document Type</Label>
                                        <Select 
                                            onValueChange={(value) => {
                                                reset();
        
                                                const selected = availableDocuments.find(doc => doc.type === value);
                                                if (!selected) return;
        
                                                setData('document_type', selected.type);
                                                setData('price', selected.price);
                                            }} 
                                            required
                                            value={data.document_type}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select document type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                            {
                                                availableDocuments.map((doc : Document) => (
                                                    <SelectItem value={doc.type}>{doc.type}  (₱{doc.price})</SelectItem>
                                                ))
                                            }
                                            </SelectContent>
                                        </Select>
                                        { data.document_type && (
                                            <p className='text-red-500 text-sm'>Price: ₱{data.price}.00</p>
                                        )}
                                        {errors.document_type && <p className="text-red-500 text-sm">{errors.document_type}</p>}
                                    </div>
        
                                    <div className="mt-8 space-y-4">
                                        <>
                                            { selectedDocumentType && (
                                                selectedDocumentType.information.map((info: any) => (
                                                    <>
                                                        <div className="flex flex-col gap-2">
        
                                                            {   info.label === 'Name' && currentTab === 'other' && (
                                                                <>
                                                                    <div>
                                                                        <Label>{info.label.replace('_', ' ')} (e.g. John F. Doe)</Label>
                                                                        <Input
                                                                            value={data[info.label.toLowerCase()]}
                                                                            placeholder={info.placeholder}
                                                                            required={info.required}
                                                                            onChange={(e) => setData(info.label.toLowerCase(), e.target.value)}
                                                                        />
                                                                        {errors[info.label.toLowerCase()] && <p className="text-red-500 text-sm">{errors[info.label.toLowerCase()]}</p>}
                                                                    </div>
            
                                                                    <div className="w-full flex gap-4 my-4">
                                                                        <div className="aspect-video w-[240px] rounded">
                                                                            <Label>Brgy. ID Front:</Label>
                                                                            <Input
                                                                                id="brgy_id_front"
                                                                                type="file"
                                                                                accept="images/*"
                                                                                hidden
                                                                                ref={brgyIdFrontRef}
                                                                                onChange={async (e) => {
                                                                                    const selectedImage = e.target.files?.[0];
                                                                                    if (!selectedImage) return;
                                                                
                                                                                    const base64Image = await imgToBase64(selectedImage);
                                                                
                                                                                    if (!selectedImage) return;
                                                                                    setData('brgyIdFront', {
                                                                                        base64: base64Image,
                                                                                        file: selectedImage
                                                                                    } as IdType);
                                                                                }}
                                                                            />
                                                                
                                                                            <div className="w-full h-full bg-white/15 rounded mt-1"
                                                                                onClick={() => {
                                                                                    const img_input: any = brgyIdFrontRef.current;
                                                                                    img_input.click();
                                                                                }}
                                                                            >
                                                                                {
                                                                                    !data.brgyIdFront
                                                                                    ?
                                                                                        (
                                                                                            <div className="w-full h-full text-xl flex items-center justify-center border border-primary/10 rounded">
                                                                                                <p className="text-foreground/50">No Image Uploaded</p>
                                                                                            </div>
                                                                                        )
                                                                                    :
                                                                                        (
                                                                                            <div className="w-full h-full overflow-hidden border rounded">
                                                                                                <img 
                                                                                                    src={"base64" in data.brgyIdFront ? data.brgyIdFront.base64 : ""} 
                                                                                                    className="w-full h-full object-cover"
                                                                                                />
                                                                                            </div>
                                                                                        )
                                                                                }
                                                                
                                                                            </div>
                                                                        </div>
                                                                
                                                                        <div className="aspect-video w-[240px] rounded">
                                                                            <Label>Brgy. ID Back:</Label>
                                                                            <Input
                                                                                id="brgy_id_back"
                                                                                type="file"
                                                                                accept="images/*"
                                                                                hidden
                                                                                ref={brgyIdBackRef}
                                                                                onChange={async (e) => {
                                                                                    const selectedImage = e.target.files?.[0];
                                                                                    if (!selectedImage) return;
                                                                
                                                                                    const base64Image = await imgToBase64(selectedImage);
                                                                
                                                                                    if (!selectedImage) return;
                                                                                    setData('brgyIdBack', {
                                                                                        base64: base64Image,
                                                                                        file: selectedImage
                                                                                    } as IdType);
                                                                
                                                                                }}
                                                                            />
                                                                
                                                                            <div className="w-full h-full bg-white/15 rounded mt-1"
                                                                                onClick={() => {
                                                                                    const img_input: any = brgyIdBackRef.current;
                                                                                    img_input.click();
                                                                                }}
                                                                            >
                                                                                {
                                                                                    !data.brgyIdBack
                                                                                    ?
                                                                                        (
                                                                                            <div className="w-full h-full text-xl flex items-center justify-center border border-primary/10 rounded">
                                                                                                <p className="text-foreground/50">No Image Uploaded</p>
                                                                                            </div>
                                                                                        )
                                                                                    :
                                                                                        (
                                                                                            <div className="w-full h-full overflow-hidden border rounded">
                                                                                                <img 
                                                                                                    src={"base64" in data.brgyIdBack ? data.brgyIdBack.base64 : ""} 
                                                                                                    className="w-full h-full object-cover"
                                                                                                />
                                                                                            </div>
                                                                                        )
                                                                                }
                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {errors['brgyId'] && <p className="text-red-500 text-sm">{errors['brgyId']}</p>}
            
                                                                    <div>
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button size="lg">
                                                                                    Take a Selfie for Verification
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="sm:max-w-[425px]">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Take a Selfie</DialogTitle>
                                                                                    <DialogDescription>
                                                                                        <p className="text-sm text-foreground/60">
                                                                                            Your selfie will be used only for identity verification and will not be shared.
                                                                                            Please position your face in the center of the frame and ensure good lighting.
                                                                                        </p>
                                                                                    </DialogDescription>
                                                                                </DialogHeader>

                                                                                <div className="grid gap-4">
                                                                                    <div>
                                                                                        { !shotTaken && !data.selfie && <Webcam ref={webcamRef} className="rounded-xl" /> }
                                                                                        { data.selfie &&
                                                                                            <div className="w-full h-full text-xl flex items-center justify-center relative rounded overflow-hidden bg-red-400">
                                                                                                <img src={"base64" in data.selfie ? data.selfie.base64 : ""} className="w-full h-full object-cover" />
                                                                                                <div className="absolute top-2 right-2">
                                                                                                    <Button 
                                                                                                        size="sm" 
                                                                                                        variant="destructive" 
                                                                                                        onClick={() => setData('selfie', null)}
                                                                                                    >
                                                                                                        Retake
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                        { shotTaken && 
                                                                                            <div className="w-full h-full text-xl flex items-center justify-center relative rounded overflow-hidden bg-red-400">
                                                                                                <img src={shotTaken} className="w-full h-full object-cover" />
                                                                                                <div className="absolute top-2 right-2">
                                                                                                    <Button 
                                                                                                        size="sm" 
                                                                                                        variant="destructive" 
                                                                                                        onClick={() => setShotTaken(null)}
                                                                                                    >
                                                                                                        Retake
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </div>

                                                                                    <div className="flex justify-center">
                                                                                        <Button size="lg" className="rounded-full aspect-square w-12 h-12" onClick={takeAShot}>
                                                                                            <Camera />
                                                                                        </Button>
                                                                                    </div>
                                                                                    
                                                                                </div>

                                                                                <DialogFooter>
                                                                                    <DialogClose asChild>
                                                                                        <Button variant="outline">Cancel</Button>
                                                                                    </DialogClose>
                                                                                    <DialogClose asChild>
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            onClick={confirmShot}
                                                                                        >
                                                                                            Confirm
                                                                                        </Button>
                                                                                    </DialogClose>
                                                                                </DialogFooter>
                                                                            </DialogContent>
                                                                        </Dialog>

                                                                        <InputError message={errors.selfie} className="mt-2 text-red-500" />
                                                                    </div>
                                                                </>
                                                            )}
                    
                                                            {   info.type === 'text' && info.label !== 'Name' && (
                                                                <div>
                                                                    <div>
                                                                        <Label>{info.label.replace('_', ' ')}</Label>
                                                                        <Input
                                                                            value={data[info.label.toLowerCase()]}
                                                                            placeholder={info.placeholder}
                                                                            required={info.required}
                                                                            onChange={(e) => setData(info.label.toLowerCase(), e.target.value)}
                                                                        />
                                                                        {errors[info.label.toLowerCase()] && <p className="text-red-500 text-sm">{errors[info.label.toLowerCase()]}</p>}
                                                                    </div>
                                                                </div>
                                                            )}
        
        
                                                            {   info.label === 'Sitio' && currentTab === 'other' && (
                                                                <div>
                                                                    <Label>{info.label.replace('_', ' ')}</Label>
                                                                    <Select 
                                                                        onValueChange={(value) => {
                                                                            setData(info.label.toLowerCase(), value)
                                                                        }} 
                                                                        required={info.required}
                                                                        value={data[info.label.toLowerCase()]}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder={info.placeholder} />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                        {   
                                                                            info?.options?.map((opt: string) => (
                                                                                <SelectItem value={opt}>{opt}</SelectItem>
                                                                            ))
                                                                        }
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {errors[info.label.toLowerCase()] && <p className="text-red-500 text-sm">{errors[info.label.toLowerCase()]}</p>}
                                                                </div>
                                                            )}
        
                                                            {   info.type === 'select' && info.label !== 'Sitio' && (
                                                                <>
                                                                    <div>
                                                                        <Label>{info.label.replace('_', ' ')}</Label>
                                                                        <Select 
                                                                            onValueChange={(value) => {
                                                                                setData('other_purpose', '');
                                                                                setData(info.label.toLowerCase(), value)
                                                                            }} 
                                                                            required={info.required}
                                                                            value={data[info.label.toLowerCase()]}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder={info.placeholder} />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                            {
                                                                                info?.options?.map((doc: string) => (
                                                                                    <SelectItem value={doc}>{doc}</SelectItem>
                                                                                ))
                                                                            }
            
                                                                            { info.label.toLowerCase() === 'purpose' && 
                                                                                <SelectItem 
                                                                                    value='other'
                                                                                >
                                                                                    Other
                                                                                </SelectItem>
                                                                            }
            
                                                                            </SelectContent>
                                                                        </Select>
                                                                        {errors[info.label.toLowerCase()] && <p className="text-red-500 text-sm">{errors[info.label.toLowerCase()]}</p>}
                                                                    </div>
            
                                                                    { info.label.toLowerCase() === 'purpose' && data['purpose'] === 'other' && (
                                                                        <div>
                                                                            <Input 
                                                                                type="text"
                                                                                placeholder='Type a purpose'
                                                                                onChange={(e) => {
                                                                                    setData('other_purpose', e.target.value)
                                                                                }}  
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
        
                                                        </div>
                                                        
                                                    </>
                                                ))
                                                
                                            )}
        
                                            {   data.document_type && 
                                                <div>
                                                    <Label>Note <span className="text-foreground/50">(Optional)</span></Label>
                                                    <Textarea
                                                        value={data['note']}
                                                        placeholder={"Add note"}
                                                        required={false}
                                                        onChange={(e) => setData('note', e.target.value)}
                                                    />
                                                    {errors['note'] && <p className="text-red-500 text-sm">{errors['note']}</p>}
                                                </div>
                                            }
                                        </>
                                    </div>
        
                                    {   selectedDocumentType && (
                                        <div className="mt-8">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button 
                                                        variant="default"
                                                        size="lg"
                                                        onClick={() => {
                                                            setData('document_request_type', currentTab as 'other' | 'user');
                                                        }}
                                                    >
                                                        Submit Request
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={submit}
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>  
                                        </div>
                                    )}
                                </div>
                            </Tabs>
                        </div>
                        <div className="flex-1 p-4 bg-gradient-to-br from-primary/6 to-white/2 rounded-lg border border-primary/15">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">How to Request a Document</h2>
                                        <p className="text-sm text-foreground/60 mt-1">
                                            Quick guide to successfully submit your document request.
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-foreground/50">Estimated Fee</p>
                                        <p className="text-lg font-medium">
                                            {selectedDocumentType ? `₱${selectedDocumentType.price}.00` : '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <div className="flex items-start gap-3 bg-white/50 dark:bg-slate-800 p-3 rounded border border-primary/10">
                                        <svg className="w-6 h-6 text-primary/80 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zM6.343 18.657A8 8 0 0112 4a8 8 0 015.657 14.657L12 22l-5.657-3.343z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium">1. Choose document</p>
                                            <p className="text-sm text-foreground/60">Select the document type from the dropdown. Estimated fee updates automatically.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-white/50 dark:bg-slate-800 p-3 rounded border border-primary/10">
                                        <svg className="w-6 h-6 text-primary/80 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0122 9.618V18a2 2 0 01-2 2H4a2 2 0 01-2-2V9.618a2 2 0 01.447-1.894L7 10" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a4 4 0 118 0v2" />
                                        </svg>
                                        <div>
                                            <p className="font-medium">2. Provide details</p>
                                            <p className="text-sm text-foreground/60">Fill required fields. If requesting for others, provide full name and upload Barangay ID front/back.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-white/50 dark:bg-slate-800 p-3 rounded border border-primary/10">
                                        <svg className="w-6 h-6 text-primary/80 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8V6a5 5 0 0110 0v2" />
                                        </svg>
                                        <div>
                                            <p className="font-medium">3. Review & submit</p>
                                            <p className="text-sm text-foreground/60">Double-check your details then click Submit. You'll see a confirmation prompt before sending.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 p-3 rounded border border-primary/10 bg-white/40 dark:bg-slate-800">
                                    <p className="font-semibold text-sm">What you'll need</p>
                                    <ul className="list-disc list-inside mt-2 text-sm text-foreground/60 space-y-1">
                                        <li>Valid Barangay ID (front & back) — required when requesting for others</li>
                                        <li>Complete full name and sitio (when applicable)</li>
                                        <li>Clear reason/purpose for the document</li>
                                    </ul>

                                    {selectedDocumentType?.information && (
                                        <div className="mt-3">
                                            <p className="font-semibold text-sm">Additional requirements for "{selectedDocumentType.type}"</p>
                                            <div className="mt-2 text-sm text-foreground/60 space-y-1">
                                                {selectedDocumentType.information.map((inf: any, idx: number) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <span className="w-2 mt-1 text-primary/80">•</span>
                                                        <span>{inf.label.replace('_', ' ')}{inf.required ? ' — required' : ''}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* <div className="flex items-center justify-between gap-3">
                                    <a
                                        href="mailto:support@barangay.local"
                                        className="text-sm text-primary/80 hover:underline"
                                    >
                                        Need help? Contact support
                                    </a>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // reveal tips: keep simple reset behaviour already available on left
                                                alert('Tip: Fill the form fields then click Submit Request. If requesting for others, upload both ID sides.');
                                            }}
                                            className="px-3 py-1 rounded bg-primary/10 text-primary/90 text-sm border border-primary/15"
                                        >
                                            Tips
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                window.print();
                                            }}
                                            className="px-3 py-1 rounded bg-primary/90 text-white text-sm"
                                        >
                                            Print Guide
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </main>
            </AppLayout>
        </>
    );
}
