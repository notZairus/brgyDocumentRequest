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

type FormType = {
    document_type: string;
    purpose: string;
    notes: string;
    preferred_pickup: string;

    name?: string;
    brgyIdFront?: IdType | File | null;
    brgyIdBack?: IdType | File | null;
}


const documentType = [
    "Barangay Clearance", 
    "Certificate of Indigency", 
    "Certificate of Residency"
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request Document',
        href: '/request-document',
    },
];

export default function Dashboard() {
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
    });
    const [currentTab, setCurrentTab] = useState<string>('u');

    const brgyIdFrontRef = useRef(null);
    const brgyIdBackRef = useRef(null);



    useEffect(() => {
        flash.success && toast(flash.success);
    }, [flash]);

    useEffect(() => {
        if (!date) return;
        setData('preferred_pickup', date.toISOString());
    }, [date]);


    function handleTabChange(value: string) {
        setCurrentTab('value');

        if (value === 'u') {
            setData('name', '');
            setData('brgyIdFront', null);
            setData('brgyIdBack', null);
        }
    }


    function submit(e: FormEvent) {
        e.preventDefault();

        if(data.purpose.length < 4) {
            setError('purpose', 'This field is important. Please answer it properly.')
            return;
        };

        if (!documentType.includes(data.document_type)) {
            setError('document_type', "Request an available document.");
            return;
        }

        if (!date) {
            setError('preferred_pickup', 'Set a pickup date');
            return;
        }

        const now = new Date();
        const twoDaysFromNowMs= now.setDate(now.getDate() + 2);
        const dateSelected = new Date(date);
        const dateSelectedMs = dateSelected.setDate(dateSelected.getDate());

        if (dateSelectedMs < twoDaysFromNowMs) {
            setError('preferred_pickup', 'Preferred pickup date must be at least 3 days from today.'); 
            return;  
        }

        post("/document-requests", {
            onFinish: () => {
                reset("purpose", "notes", "preferred_pickup");
                setDate(undefined);
                clearErrors();
            }
        });
    }

    function submitOther(e: FormEvent) {
        e.preventDefault();

        if(data.purpose.length < 4) {
            setError('purpose', 'This field is important. Please answer it properly.')
            return;
        };

        if (!documentType.includes(data.document_type)) {
            setError('document_type', "Request an available document.");
            return;
        }

        if (!date) {
            setError('preferred_pickup', 'Set a pickup date');
            return;
        }

        const now = new Date();
        const twoDaysFromNowMs= now.setDate(now.getDate() + 2);
        const dateSelected = new Date(date);
        const dateSelectedMs = dateSelected.setDate(dateSelected.getDate());

        if (dateSelectedMs < twoDaysFromNowMs) {
            setError('preferred_pickup', 'Preferred pickup date must be at least 3 days from today.'); 
            return;  
        }


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


        post("/document-requests", {
            onFinish: () => {
                reset("purpose", "notes", "preferred_pickup");
                setDate(undefined);
                clearErrors();
            }
        });
    }

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Request a Document" />
    
                <main className="w-full p-4">

                    <Tabs defaultValue="u" onValueChange={handleTabChange}>
                        <TabsList className="w:md bg-transparent lg:w-md mx-auto">
                            <TabsTrigger value="u" >For You</TabsTrigger>
                            <TabsTrigger value="other">For Others</TabsTrigger>
                        </TabsList>
                        <TabsContent value="u">
                            <form onSubmit={submit} className="max-w-xl mx-auto space-y-4 my-8">
                                <div className="flex flex-col gap-2">
                                    <Label>Document Type</Label>
                                    <Select onValueChange={(value) => setData("document_type", value)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Barangay Clearance">Barangay Clearance</SelectItem>
                                            <SelectItem value="Certificate of Indigency">Certificate of Indigency</SelectItem>
                                            <SelectItem value="Certificate of Residency">Certificate of Residency</SelectItem>
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
                                                {date ? date.toLocaleDateString() : "Select date"}
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

                                <Button size="lg" className="mt-4" type="submit" disabled={processing}>
                                    Submit Request
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="other">
                            <form onSubmit={submitOther} className="max-w-xl mx-auto space-y-4 my-8">
                            
                                <div className="flex flex-col gap-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                </div>
                            
                                {/* /////////////////////////////////////////////////////////////////// */}
                            
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
                            
                                        <div className="w-full h-full bg-white/30 rounded mt-1"
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
                            
                                        <div className="w-full h-full bg-white/30 rounded mt-1"
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
                            
                                {/* /////////////////////////////////////////////////////////////////// */}
                            
                            
                            
                                <div className="flex flex-col gap-2">
                                    <Label>Document Type</Label>
                                    <Select onValueChange={(value) => setData("document_type", value)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Barangay Clearance">Barangay Clearance</SelectItem>
                                            <SelectItem value="Certificate of Indigency">Certificate of Indigency</SelectItem>
                                            <SelectItem value="Certificate of Residency">Certificate of Residency</SelectItem>
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
                                                {date ? date.toLocaleDateString() : "Select date"}
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
                            
                                <Button size="lg" className="mt-4" type="submit" disabled={processing}>
                                    Submit Request
                                </Button>
                            </form>
                                

                        </TabsContent>
                    </Tabs>


                    
                </main>
    
            </AppLayout>
        </>
    );
}
