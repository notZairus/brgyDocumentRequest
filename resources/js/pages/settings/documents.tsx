import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Documents() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Documents Settings"
                        description="This tab is for configuring document templates, adding new document types, and managing other document-related settings."
                    />
                    
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
