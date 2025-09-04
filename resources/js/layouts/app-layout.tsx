import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { PageProps } from "@inertiajs/core";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

interface MyProps {
    flash: {
        success: string,
        error: string
    }
};

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage<PageProps &MyProps>().props;

    useEffect(() => {
        flash.success && toast.success(flash.success);
        flash.error && toast.error(flash.error, {
            description: 'Input a valid address'
        });
    }, [flash]);


    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    )
}
