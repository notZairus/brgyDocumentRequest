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


type IdType = {
    'base64': string,
    'file': File
}


type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    brgyIdFront: IdType | File | null;
    brgyIdBack: IdType | File | null;
};


export default function Register() {
    const { data, setData, post, processing, errors, reset, setError } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        brgyIdFront: null,
        brgyIdBack: null,
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
            <form className="flex flex-col gap-6" onSubmit={submit}>
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

                        <div className="aspect-5/3  border rounded"
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
                                            <p className="text-black">No Image Uploaded</p>
                                        </div>
                                    )
                                :
                                    (
                                        <div className="w-full h-full text-xl flex items-center justify-center rounded overflow-hidden bg-red-400">
                                            <img src={data.brgyIdFront.base64} className="w-full h-full object-cover" />
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
                                            <p className="text-black">No Image Uploaded</p>
                                        </div>
                                    )   
                                :   
                                    (
                                        <div className="w-full h-full text-xl flex items-center justify-center rounded overflow-hidden bg-red-400">
                                            <img src={data.brgyIdBack.base64} className="w-full h-full object-cover" />
                                        </div>
                                    )
                            }
                        </div>
                        <InputError message={errors.brgyIdBack} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
