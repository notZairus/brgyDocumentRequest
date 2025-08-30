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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { imgToBase64 } from '@/lib/utils';
import { availableDocuments } from "@/datas";
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request Document',
        href: '/request-document',
    },
];

type useFormProps = {
    document_request_type: 'user' | 'other',
    document_type: string,
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
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const { flash } = usePage<PageProps & MyProps>().props;
    const { data, setData, post, processing, errors, setError, reset, clearErrors } = useForm<useFormProps>({
        document_request_type: 'user',
        document_type: '',
    });
    const [currentTab, setCurrentTab] = useState<string>('user');
    const brgyIdFrontRef = useRef(null);
    const brgyIdBackRef = useRef(null);

    let selectedDocumentType = availableDocuments.find((doc) => doc.type == data.document_type);

    useEffect(() => {
        flash.success && toast.success(flash.success);
        flash.error && toast.error(flash.error, {
            description: 'Input a valid address'
        });
    }, [flash]);


    function setTab(tab: string) {
        setData('document_typerequest_type', tab);
        setCurrentTab(tab);
    }


    function submit() {
        clearErrors();

        if (data['document_type'] === 'Certificate of Indigency') {

            if (currentTab !== 'user') {
                if (!data['name'] || data['name'].trim().length <= 5) {
                    setError('name', "Please enter your full name.")
                    return;
                }
            }
            
            

            if (! data['purpose']) {
                setError('purpose', 'Purpose is required. Please select a purpose.');
                return;
            }

            if (! data['sitio']) {
                setError('sitio', 'Sitio is required. Please select a sitio.');
                return;
            }
            
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
                        defaultValue="user" 
                        onValueChange={(value) => {
                            reset();
                            setTab(value);
                        }}
                    >
                        <TabsList className="w:md bg-transparent lg:w-md mx-auto">
                            <TabsTrigger value="user" >For You</TabsTrigger>
                            <TabsTrigger value="other">For Others</TabsTrigger>
                        </TabsList>
                        
                        <div className="max-w-xl w-full mx-auto space-y-4 my-8">

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
                                            <SelectItem value={doc.type}>{doc.type}</SelectItem>
                                        ))
                                    }
                                    </SelectContent>
                                </Select>
                                {errors.document_type && <p className="text-red-500 text-sm">{errors.document_type}</p>}
                            </div>

                            <div className="mt-8 space-y-4">
                                <>
                                    { selectedDocumentType && (
                                        selectedDocumentType.information
                                            .filter((info) => {
                                                return info.label !== 'Name' ? true : currentTab !== 'user' ? true : false
                                            })
                                            .map((info, index) => (
                                            <div className="flex flex-col gap-2">
                                                <Label>{info.label.replace('_', ' ')}</Label>
        
        
                                                {   info.type === 'text' && 
                                                    <Input
                                                        value={data[info.label.toLowerCase()]}
                                                        placeholder={info.placeholder}
                                                        required={info.required}
                                                        onChange={(e) => setData(info.label.toLowerCase(), e.target.value)}
                                                    />
                                                }
        
        
                                                {   info.type === 'select' && 
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
                                                            info?.options?.map(doc => (
                                                                <SelectItem value={doc}>{doc}</SelectItem>
                                                            ))
                                                        }
                                                        </SelectContent>
                                                    </Select>
                                                }
        
        
                                                {errors[info.label.toLowerCase()] && <p className="text-red-500 text-sm">{errors[info.label.toLowerCase()]}</p>}
                                            </div>
                                        ))
                                    )}
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
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
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
