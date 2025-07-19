import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
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
import { FormEvent } from "react";


const documentType = [
    "Barangay Clearance", 
    "Certificate of Indigency", 
    "Certificate of Residency"
];


interface MyProps {
    auth: {
        user: User
    }
} 


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request Document',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth : { user } } = usePage<PageProps & MyProps>().props;
    const { data, setData, post, processing, errors, setError, reset } = useForm({
        document_type: '',
        purpose: '',
        notes: '',
        preferred_pickup: '',
    });

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

        const now = new Date();
        const twoDaysFromNowMs= now.setDate(now.getDate() + 2);

        const dateSelected = new Date(data.preferred_pickup);
        const dateSelectedMs = dateSelected.setDate(dateSelected.getDate());

        if (dateSelectedMs < twoDaysFromNowMs || !data.preferred_pickup) {
            setError('preferred_pickup', 'Preferred pickup date must be at least 3 days from today.'); 
            return;  
        }

        post("/document-request", {
            onFinish: () => {
                reset();
            }
        });
    }

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Request a Document" />
    
                <main className="w-full p-4">
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
                            <Input
                                type="date"
                                value={data.preferred_pickup}
                                onChange={(e) => setData("preferred_pickup", e.target.value)}
                            />
                            {errors.preferred_pickup && <p className="text-red-500 text-sm">{errors.preferred_pickup}</p>}
                        </div>

                        <Button size="lg" className="mt-4" type="submit" disabled={processing}>
                            Submit Request
                        </Button>
                    </form>
                </main>
    
            </AppLayout>
        </>
    );
}
