import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { imgToBase64 } from "@/lib/utils";
import { useRef } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { sitios } from "@/datas";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';



type IdType = {
    'base64': string,
    'file': File
}


type RegisterForm = {
    name: string;
    email: string;
    sitio: string;
    password: string;
    password_confirmation: string;
    brgyIdFront: IdType | File | null;
    brgyIdBack: IdType | File | null;
    accept_terms?: boolean;
};


export default function Register() {
    const { data, setData, post, processing, errors, reset, setError } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        sitio: '',
        password: '',
        password_confirmation: '',
        brgyIdFront: null,
        brgyIdBack: null,
        accept_terms: false,
    });
    const brgyIdFrontRef = useRef(null);
    const brgyIdBackRef = useRef(null);



    const submit: FormEventHandler = (e) => {
        e.preventDefault();

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

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation', 'brgyIdFront', 'brgyIdBack'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <div className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}bg-red-400
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <Label>Sitio</Label>
                        <Select 
                            onValueChange={(value) => {
                                setData('sitio', value)
                            }} 
                            required={true}
                            value={data['sitio']}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={'Select a sitio'} />
                            </SelectTrigger>
                            <SelectContent>
                            {
                                sitios.map(doc => (
                                    <SelectItem value={doc}>{doc}</SelectItem>
                                ))
                            }
                            </SelectContent>
                        </Select>
                        {errors['sitio'] && <p className="text-red-500 text-sm">{errors['sitio']}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="brgy_id">Brgy ID Front:</Label>
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

                        <div className="aspect-5/3 border rounded"
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
                                        <div className="w-full h-full text-xl flex items-center justify-center rounded overflow-hidden bg-red-400">
                                            <img 
                                                src={"base64" in data.brgyIdFront ? data.brgyIdFront.base64 : ""} 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                    )
                            }
                        </div>
                        <InputError message={errors.brgyIdFront} />
                    </div>


                    <div className="grid gap-2">
                        <Label htmlFor="brgy_id">Brgy ID Back:</Label>
                        <Input
                            id="brgy_id_back"
                            type="file"
                            accept="image/*"
                            hidden
                            ref={brgyIdBackRef}
                            onChange={async (e) => {
                                const selectedImage = e.target.files?.[0];
                                if (!selectedImage) return;
                                
                                const base64Image = await imgToBase64(selectedImage);
                                
                                setData('brgyIdBack', {
                                    base64: base64Image,
                                    file: selectedImage
                                } as IdType);
                            }}
                        />
                        <div 
                            className="aspect-5/3  border rounded"
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
                                        <div className="w-full h-full text-xl flex items-center justify-center rounded overflow-hidden bg-red-400">
                                            <img src={"base64" in data.brgyIdBack ? data.brgyIdBack.base64 : ""} className="w-full h-full object-cover" />
                                        </div>
                                    )
                            }
                        </div>
                        <InputError message={errors.brgyIdBack} />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Create Account</Button>
                        </DialogTrigger>
                        <DialogContent className="">
                            <DialogHeader>
                                <DialogTitle>Terms and Conditions</DialogTitle>
                                <DialogDescription>
                                    Please read and accept the terms and conditions before creating an account.
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="h-[300px] text-sm rounded-md border p-4">
                                <div className="space-y-4 text-foreground">
                                    <p>
                                        By creating an account, you agree to abide by the following terms and conditions:
                                    </p>
                                    <ol className="list-decimal list-inside space-y-2">
                                        <li>
                                            <strong>Accuracy of Information:</strong> You confirm that all information and documents provided are true, accurate, and complete. Providing false or misleading information may result in account suspension or termination.
                                        </li>
                                        <li>
                                            <strong>Use of Personal Data:</strong> Your personal data and uploaded documents will be used solely for verification and account management purposes in accordance with our privacy policy.
                                        </li>
                                        <li>
                                            <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                                        </li>
                                        <li>
                                            <strong>Prohibited Activities:</strong> You agree not to use this service for any unlawful, fraudulent, or malicious activities.
                                        </li>
                                        <li>
                                            <strong>Changes to Terms:</strong> We reserve the right to update these terms and conditions at any time. Continued use of your account constitutes acceptance of any changes.
                                        </li>
                                        <li>
                                            <strong>Termination:</strong> Violation of these terms may result in suspension or permanent removal of your account.
                                        </li>
                                    </ol>
                                    <p>
                                        Please review our full privacy policy and contact us if you have any questions before proceeding.
                                    </p>
                                    <div className="flex items-center gap-2 mt-5">
                                        <Checkbox
                                            id="accept_terms"
                                            checked={data.accept_terms ?? false}
                                            onCheckedChange={e => setData('accept_terms', e as boolean)}
                                            disabled={processing}
                                            required
                                        />
                                        <Label htmlFor="accept_terms" className="cursor-pointer select-none">
                                            I have read and accept the terms and conditions.
                                        </Label>
                                    </div>
                                    <InputError message={errors.accept_terms} />
                                </div>
                            </ScrollArea>

                            <DialogFooter className="flex items-center mt-4">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button disabled={!data.accept_terms || processing } onClick={submit} tabIndex={5} >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Create account
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
