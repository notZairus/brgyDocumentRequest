import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Users, LayoutGrid, ShieldAlert, ScrollText, List, Logs, Flag } from 'lucide-react';
import AppLogo from './app-logo';
import { MyPageProps } from "@/types/index.d";



const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        for: "all"
    },

    {
        title: 'Document Requests',
        href: '/document-requests',
        icon: ScrollText,
        for: "admin"
    },
    {
        title: 'Verify Accounts',
        href: '/verify-accounts',
        icon: ShieldAlert,
        for: "admin"
    },

    {
        title: 'Request Document',
        href: '/request-document',
        icon: List,
        for: "user/verified"
    },
    {
        title: 'My Requests',
        href: '/my-requests',
        icon: ScrollText,
        for: "user/verified"
    },
    {
        title: 'Appeals',
        href: '/appeals',
        icon: Flag,
        for: "admin"
    },


    

];

const footerNavItems: NavItem[] = [
    {
        title: 'Manage Users',
        href: '/users',
        icon: Users,
        for: "admin"
    },
    {
        title: 'Activity Logs',
        href: '/logs',
        icon: Logs,
        for: "admin"
    },
];

export function AppSidebar() {
    const { auth: { user }} = usePage<MyPageProps>().props;

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {user.is_admin ? <NavFooter items={footerNavItems} className="mt-auto" /> : null }
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
