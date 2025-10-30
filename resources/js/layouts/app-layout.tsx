import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { PageProps } from "@inertiajs/core";
import AppealReasonDialog from '@/components/appeal-reason-dialog';


interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

type ErrorType = {
    message: string;
    penalty_id: number;
};

interface MyProps {
    flash: {
        success?: string,
        error?: ErrorType
    }
};

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage<PageProps & MyProps>().props;

    useEffect(() => {
        flash.success && toast.success(flash.success);

        if (flash.error?.message?.startsWith('You have an active penalty.')) {
            flash.error && toast.error(flash.error.message, {
                description: (
                    <>
                        <div className="mt-2 flex items-end justify-end">
                            <AppealReasonDialog penalty_id={flash.error?.penalty_id} message={flash.error?.message} />
                        </div>
                    </>
                ),
            });

            return;
        }
        
        flash.error && toast.error(flash.error.message ?? flash.error);
    }, [flash]);


    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    )
}
