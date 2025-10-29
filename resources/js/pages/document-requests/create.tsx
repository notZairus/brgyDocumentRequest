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
    });

    const [currentTab, setCurrentTab] = useState<string>('user');
    const brgyIdFrontRef = useRef(null);
    const brgyIdBackRef = useRef(null);

    const selectedDocumentType: Document | undefined = availableDocuments.find((doc: Document) => doc.type == data.document_type);

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

                    <Tabs 
                        defaultValue="user" 
                        onValueChange={(value) => {
                            reset();
                            setTab(value);
                        }}
                    >
                        <TabsList className="w:md bg-primary/5 lg:w-md mx-auto">
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
                                                                <Label>{info.label.replace('_', ' ')}</Label>
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
                                                                    <Label>ID Front:</Label>
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
                                                                                    <div className="w-full h-full text-xl flex items-center justify-center">
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
                                                                    <Label>ID Back:</Label>
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
                                                                                    <div className="w-full h-full text-xl flex items-center justify-center">
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
                </main>
            </AppLayout>
        </>
    );
}
