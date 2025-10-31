import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import type { Document } from "@/types/index.d.ts";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { base64ToDocx } from "@/lib/utils";


import { nanoid } from "nanoid";


import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

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
} from "@/components/ui/alert-dialog";

import { useForm } from "@inertiajs/react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documents settings',
        href: '/settings/documents',
    },
    {
        title: 'Configure',
        href: '/settings/documents',
    },
];



export default function Documents() {
    const { document, template } = usePage<Document & { [key: string]: any }>().props;
    const { data, setData, post, errors, clearErrors, setError } = useForm<any>({
        ...document,
        information: JSON.parse(document.information as string),
        template: "",
        method: 'put',
    });
    const { delete: destroy } = useForm<{ document_id: number }>({
        document_id: document.id,
    })
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (template) {
        const file = base64ToDocx(
            template,
            `${nanoid()}.docx`,
        );      
        setData('template', file);
      }
    }, [template])

    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents settings" />

            <SettingsLayout>
                <div className="space-y-6 pb-8">
                    <HeadingSmall
                        title="Documents Settings"
                        description="This tab is for configuring document templates, adding new document types, and managing other document-related settings."
                    />

                    <Separator />

                    <div className="flex gap-3">
                        <div className="flex-2">
                            <Label>
                                Document Type
                            </Label>
                            <Input
                                type="text"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="mt-1 mb-4"
                            />
                        </div>
                        <div>
                            <Label>
                                Price
                            </Label>
                            <Input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="mt-1 mb-4"
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Template <span className="text-sm text-muted-foreground">(.docx file with merge field placeholders)</span></Label>
                        
                            <Input
                                type="file"
                                className={`mt-1 mb-4 ${data.template ? 'hidden' : ''}`}
                                ref={fileRef}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setData('template', e.target.files[0]);
                                    }
                                }}
                            />
                        
                        {data.template && (
                            <div className="flex items-center justify-between gap-4 mt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10 text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M14 2v6h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="text-sm font-medium truncate cursor-pointer"
                                            onClick={() => {
                                                if (!fileRef.current) return;
                                                fileRef.current.click();
                                            }}
                                            title={typeof data.template === "string" ? "document.docx" : (data.template?.name ?? "document.docx")}
                                        >
                                            {typeof data.template === "string" ? "document.docx" : (data.template?.name ?? "document.docx")}
                                        </p>
                                        {typeof data.template !== "string" && data.template?.size ? (
                                            <p className="text-xs text-muted-foreground">
                                                {(data.template.size / 1024).toFixed(1)} KB
                                            </p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">.docx template</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (!fileRef.current) return;
                                            fileRef.current.click();
                                        }}
                                    >
                                        Replace
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            setData('template', '');
                                            if (fileRef.current) {
                                                fileRef.current.value = '';
                                            }
                                        }}
                                    >
                                        Remove
                                    </Button>

                                    {typeof data.template !== "string" && data.template ? (
                                        <a
                                            href={URL.createObjectURL(data.template)}
                                            download={(data.template as File).name ?? 'document.docx'}
                                            className="inline-block"
                                        >
                                            <Button size="sm" variant="outline">
                                                Download
                                            </Button>
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <Label>Input Fields</Label>

                    <div className="space-y-4 mt-4">
                        {
                            data && data.information.map((info: any, index: number) => (
                                <div className="bg-primary/5 rounded p-4 border border-primary/15" key={index}>

                                    <div className="flex justify-between items-center mb-4">

                                        <div className="flex gap-4 items-center">
                                            <Label>Type:</Label>
                                            <Select
                                                value={info.type}
                                                onValueChange={(value) => {
                                                    const infos = [...data.information as any[]];
                                                    const indexOfInfo = infos.findIndex((information) => information === info);
                                                    infos[indexOfInfo].type = value;
                                                    setData('information', infos);
                                                }}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select field type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="select">Select</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete Field
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This action will delete this field.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => {
                                                                const infos = [...data.information];
                                                                infos.splice(index, 1);
                                                                setData('information', infos);
                                                            }}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>


                                    <div className="flex gap-4">
                                        <div className="flex-2">
                                            <Label>Label</Label>
                                            <Input
                                                type="text"
                                                className="mt-1 mb-4"
                                                placeholder={"Input Field Label"}
                                                value={info.label.replace("_", " ")}
                                                onChange={(e) => {
                                                    const infos = [...data.information as any[]];
                                                    const indexOfInfo = infos.findIndex((information) => information === info);
                                                    infos[indexOfInfo].label = e.target.value.replace(" ", "_");
                                                    setData('information', infos);
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <Label>Placeholder</Label>
                                            <Input
                                                type="text"
                                                className="mt-1 mb-4"
                                                placeholder={"Input Field Label"}
                                                value={info.placeholder}
                                                onChange={(e) => {
                                                    const infos = [...data.information as any[]];
                                                    const indexOfInfo = infos.findIndex((information) => information === info);
                                                    infos[indexOfInfo].placeholder = e.target.value;
                                                    setData('information', infos);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {
                                        info.type === 'select' ? (
                                            <>

                                                <div>
                                                    <Label>Options <span className="font-bold">(comma+space separated)</span></Label>
                                                    <Textarea
                                                        className="mt-1 mb-4"
                                                        placeholder="Option1, Option2, Option3"
                                                        value={info.options?.join(', ')}
                                                        onChange={(e) => {
                                                            const infos = [...data.information];
                                                            const indexOfInfo = infos.findIndex((information) => information === info);
                                                            infos[indexOfInfo].options = e.target.value.split(', ');
                                                            setData('information', infos);
                                                        }}
                                                    />
                                                </div>
                                            </ >
                                        ) : null
                                    }

                                </div>



                            ))


                        }

                        <div>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => {
                                    const newInfo = {
                                        type: 'text',
                                        label: '',
                                        placeholder: '',
                                        required: true,
                                        options: []
                                    };
                                    setData('information', [...data.information, newInfo]);
                                }}
                            >
                                Add New Field
                            </Button>
                        </div>
                    </div>


                    <div>
                        <div className="flex justify-end mt-6 space-x-4">

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="lg" variant="destructive">
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete this document. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                destroy(`/settings/documents`);
                                            }}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="lg">
                                        Save Changes
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Save changes?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will save your changes to the document template.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                post('/settings/documents');
                                            }}
                                        >
                                            Save
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>


                        </div>
                    </div>


                </div>
            </SettingsLayout>
        </AppLayout>
    );
}