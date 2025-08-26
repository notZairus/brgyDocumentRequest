import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from "@inertiajs/core";
import type { User } from "@/types/index.d.ts";
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
import { FormEvent, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { imgToBase64 } from '@/lib/utils';
import { availableDocuments } from "@/datas";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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



interface MyProps {
    auth: {
        user: User
    }, 
    flash: {
        success: string,
        error: string
    }
};

type IdType = {
    'base64': string,
    'file': File
}

type DeliveryMethod = "Pick-up" | "Deliver";

type FormType = {
    document_type: string;
    purpose: string;
    notes: string;
    preferred_pickup: string;

    name?: string;
    brgyIdFront?: IdType | File | null;
    brgyIdBack?: IdType | File | null;

    total?: number;
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request Document',
        href: '/request-document',
    },
];



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
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const { flash } = usePage<PageProps & MyProps>().props;
    const { data, setData, post, processing, errors, setError, reset, clearErrors } = useForm<FormType>({
        document_type: '',
        purpose: '',
        notes: '',
        preferred_pickup: '',

        name: '',
        brgyIdFront: null,
        brgyIdBack: null,

        total: 0
    });
    const [currentTab, setCurrentTab] = useState<string>('u');
    const brgyIdFrontRef = useRef(null);
    const brgyIdBackRef = useRef(null);
    
    let total = availableDocuments.find((doc) => doc.type == data.document_type)?.price ?? 0;


    useEffect(() => {
        flash.success && toast.success(flash.success);
        flash.error && toast.error(flash.error, {
            description: 'Input a valid address'
        });
    }, [flash]);


    useEffect(() => {
        if (!date) return;
        setData('preferred_pickup', date.toISOString());
    }, [date]);


    function submit(e: FormEvent) {
        // check if the purpose is valid.
        if(data.purpose.length < 4) {
            setError('purpose', 'This field is important. Please answer it properly.')
            return;
        };

        // check if the document type that the request user is available.
        if (!availableDocuments.map((doc) => doc.type).includes(data.document_type)) {
            setError('document_type', "Request an available document.");
            return;
        }

        // check if the pickup date is not empty.
        if (!date) {
            setError('preferred_pickup', 'Set a pickup date');
            return;
        }

        // check if the date is 3 days from now.
        const now = new Date();
        const twoDaysFromNowMs= now.setDate(now.getDate() + 2);
        const dateSelected = new Date(date);
        const dateSelectedMs = dateSelected.setDate(dateSelected.getDate());

        if (dateSelectedMs < twoDaysFromNowMs) {
            setError('preferred_pickup', 'Preferred pickup date must be at least 3 days from today.'); 
            return;  
        }

        // if the user request other person's document. check if there is an inputted id.
        if (currentTab === 'other') {
            if (!data.brgyIdFront) {
                setError('brgyIdFront', 'The Brgy ID Front image is required.');
                return;
            }
        
            if (!data.brgyIdBack) {
                setError('brgyIdBack', 'The Brgy ID Back image is required.');
                return;
            }

            const idFrontFile = "file" in data.brgyIdFront ? data.brgyIdFront.file : data.brgyIdFront;
            const idBackFile = "file" in data.brgyIdBack ? data.brgyIdBack.file : data.brgyIdBack; 

            setData('brgyIdFront', idFrontFile);
            setData('brgyIdBack', idBackFile);
        }

        post("/document-requests", {
            onFinish: () => {
                reset();
                setDate(undefined);
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
                        defaultValue="u" 
                        onValueChange={(value) => {
                            reset();
                            setCurrentTab(value);
                        }}
                    >
                        <TabsList className="w:md bg-transparent lg:w-md mx-auto">
                            <TabsTrigger value="u" >For You</TabsTrigger>
                            <TabsTrigger value="other">For Others</TabsTrigger>
                        </TabsList>
                        
                        <div className="max-w-xl w-full mx-auto space-y-4 my-8">
                        
                            { currentTab === 'other' && 
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                    </div>
                            
                                    <div className="w-full flex gap-4">
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
                                </>
                            }
                        
                            <div className="flex flex-col gap-2">
                                <Label>Document Type</Label>
                                <Select 
                                    onValueChange={(value) => {
                                        setData("document_type", value)
                                    }} 
                                    required
                                    value={data.document_type}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select document type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                    {
                                        availableDocuments.map(doc => (
                                            <SelectItem value={doc.type}>{doc.type} (₱{doc.price}.00)</SelectItem>
                                        ))
                                    }
                                    </SelectContent>
                                </Select>
                                {errors.document_type && <p className="text-red-500 text-sm">{errors.document_type}</p>}
                            </div>
                        
                            <div className="flex flex-col gap-2">
                                <Label>Purpose</Label>
                                <Input
                                    value={data.purpose}
                                    onChange={(e) => setData("purpose", e.target.value)}
                                />
                                {errors.purpose && <p className="text-red-500 text-sm">{errors.purpose}</p>}
                            </div>
                        
                            <div className="flex flex-col gap-2">
                                <Label>Additional Notes (optional)</Label>
                                <Textarea
                                    className="resize-none"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                />
                            </div>
                        
                            <div className="flex flex-col gap-2">
                                <Label>Preferred Pickup Date (optional)</Label>
                        
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            className="w-fukk justify-between border font-normal bg-background text-primary hover:bg-secondary"
                                        >
                                            {data.preferred_pickup ? new Date(data.preferred_pickup).toLocaleDateString() : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                        
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            required
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(date: Date) => {
                                                setDate(date);
                                                setOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.preferred_pickup && <p className="text-red-500 text-sm">{errors.preferred_pickup}</p>}
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        onClick={() => {
                                            setData('total', total);
                                        }} 
                                        variant="default"
                                        size="lg"
                                        className="mt-4"
                                    >
                                        Submit Request
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
                                        <AlertDialogAction onClick={submit}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </Tabs>
                </main>
            </AppLayout>
        </>
    );
}
