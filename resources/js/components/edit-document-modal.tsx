import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import type { MyPageProps, DocumentRequest } from "@/types/index.d.ts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { usePage } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { availableDocuments } from "@/datas";
import { useForm } from '@inertiajs/react';


interface CustomPageProps {
    documentRequest: DocumentRequest,
    activityLog: any,
    flash: {
        success: string,
        error: string
    }
};

interface MyProps {
    flash: {
        success: string,
        error: {
            message: string,
            penalty_id?: number
        }
    }
};


export default function EditDocumentDialog( ) {
    const { documentRequest } = usePage<MyPageProps & CustomPageProps>().props;
    const { data, setData, errors } = useForm({
        ...documentRequest.document_details
    });
    
    
    const selectedDocumentType = availableDocuments.find(doc => doc.type === documentRequest.document_type);
    
    if (!selectedDocumentType) {
        return <div>Document type not found.</div>;
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="text-blue-500 font-bold cursor-pointer" >
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Details</DialogTitle>
                    <DialogDescription>
                        Update the details below as needed. Make sure all information is correct before saving your changes.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">

                    { selectedDocumentType.information.map(info => (
                        <>
                            { info.type === 'text' ? (
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
                            ) : null }

                            {   info.type === 'select' ? (
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
                                            info?.options?.map(doc => (
                                                <SelectItem value={doc}>{doc}</SelectItem>
                                            ))
                                        }
                                        </SelectContent>
                                    </Select>
                                    {errors[info.label.toLowerCase()] && <p className="text-red-500 text-sm">{errors[info.label.toLowerCase()]}</p>}
                                </div>
                            ) : null }
                        </>
                    ))}



                        
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Link href={`/document-requests/${documentRequest.id}`} method="patch" data={data}>
                            <Button>Update</Button>
                        </Link>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
