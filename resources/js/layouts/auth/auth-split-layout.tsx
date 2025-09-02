import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        // <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
        //     <div className="relative hidden h-full flex-col items-center justify-center p-10 text-white lg:flex dark:border-r bg-red-400 max-w-[500px]">
        //         <div className="absolute inset-0 bg-matictic" />
        //         <Link href={route('home')} className="relative z-20 flex mt-auto items-center font-medium flex-col gap-8 text-3xl">
        //             <AppLogoIcon className="mr-2 size-24 fill-current text-white" />
        //             Matictic Document Portal
        //         </Link>
        //         {quote && (
        //             <div className="relative z-20 mt-auto">
        //                 <blockquote className="space-y-2">
        //                     <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
        //                     <footer className="text-sm text-neutral-300">{quote.author}</footer>
        //                 </blockquote>
        //             </div>
        //         )}
        //     </div>
        //     {/* <div className="w-full lg:p-8">
        //         <div className="mx-auto flex w-full flex-col justify-center space-y-6">
        //             <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
        //                 <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
        //             </Link>
        //             <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
        //                 <h1 className="text-xl font-medium">{title}</h1>
        //                 <p className="text-sm text-balance text-muted-foreground">{description}</p>
        //             </div>
        //             {children}
        //         </div>
        //     </div> */}

        //     <div className="bg-red-400 w-full h-full">

        //     </div>
        // </div>

        <div className="w-full min-h-dvh bg-red-400 flex flex-col-reverse md:flex-row">

            <div className="md:w-[500px] max-h-dvh w-full hidden md:block" />

            <div className="md:w-[500px] max-h-dvh w-full md:fixed md:top-0 md:bottom-0 bg-matictic text-white shadow-lg flex flex-col items-center justify-between py-20 gap-8 px-12">
                <Link href={route('home')} className="relative z-20 flex mt-auto items-center font-medium flex-col gap-8 text-3xl sm:text-left text-center">
                    <AppLogoIcon className="mr-2 size-24 fill-current text-white" />
                    Matictic Document Portal
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-neutral-300">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="flex-1 bg-background flex items-center justify-center py-20 px-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:max-w-md max-w-[320px]">
                     <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                         <h1 className="text-xl font-medium">{title}</h1>
                         <p className="text-sm text-balance text-muted-foreground">{description}</p>
                     </div>
                     {children}
                </div>
            </div>
        </div>
    );
}
