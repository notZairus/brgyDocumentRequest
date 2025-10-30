import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

import { usePage } from "@inertiajs/react";
import { PageProps } from "@inertiajs/core";
import { useState } from "react";
import type { Document } from "@/types/index.d.ts";

import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documents settings',
        href: '/settings/appearance',
    },
];



export default function Documents() {
    const { available_documents } = usePage<Document[] & PageProps & { [key: string]: any }>().props;
    const [availableDocuments, setAvailableDocuments] = useState<Document[]>(
        available_documents.map((doc: Document) => ({
            ...doc,
            information: JSON.parse(doc.information as string),
            collapsed: false,
        }))
    );
    

    const addNewDocumentType = () => {
        const newDocumentType = {
            type: 'New Document',
            description: '',
            price: 0,
            information: [],
        };

        setAvailableDocuments(prevDocs => [...prevDocs, newDocumentType]);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents settings" />

            <SettingsLayout>
                <div className="space-y-6 pb-6">
                    <HeadingSmall
                        title="Documents Settings"
                        description="This tab is for configuring document templates, adding new document types, and managing other document-related settings."
                    />

                    <div className="space-y-4">
                        {availableDocuments.map((document) => (
                            <div key={document.type} className="p-4 bg-primary/5 border rounded-md shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{document.type} (₱{ document.price.toFixed(2) })</h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {document.description ?? <span className="italic text-gray-400">No description</span>}
                                        </p>
                                    </div>

                                    <Link href={`/settings/documents/${document.id}`} className="font-bold text-right hover:underline transition cursor-pointer">
                                        Configure
                                    </Link>
                                </div>

                                <div className="mt-4">
                                    <h2 className="font-semibold mb-2 text-primary/80">Input Fields</h2>
                                    <div className="space-y-2 ">
                                        {
                                            document.information.map((info: any) => {
                                            
                                                return (
                                                    <div className="text-sm p-2 bg-primary/5 border-primary/20 border w-full min-h-8 rounded">
                                                        <div className="flex justify-between">
                                                            <p>
                                                                <span className="text-primary/50 block">Label:</span> { info.label.toUpperCase() }
                                                            </p>
                                                            <p className="w-[80px] text-left">
                                                                <span className="text-primary/50 block">Type:</span> { info.type.toUpperCase() }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* <div className="w-full">
                            <Button
                                size="lg"
                                className="w-full bg-primary/10 hover:bg-primary/15 cursor-pointer transition text-white font-semibold py-2 rounded-md shadow"
                                onClick={addNewDocumentType}
                            >
                                Add New Document Type
                            </Button>
                        </div> */}
                    </div>


                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
