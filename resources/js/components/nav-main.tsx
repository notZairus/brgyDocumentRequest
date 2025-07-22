import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from "@inertiajs/core";


export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { auth: { user } } = usePage<PageProps>().props;
    

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Navigations</SidebarGroupLabel>
            <SidebarMenu>
                {
                    items.map((item) => {
                        const SidebarMenu = <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                                    <Link href={item.href}>
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>;


                        if (item.for === "all") {
                            return SidebarMenu
                        }

                        if (user.is_admin && item.for === "admin") {
                            return SidebarMenu
                        }

                        if (!user.is_admin) {
                            if (!user.verified_at && item.for === "user/unverified") {
                                return SidebarMenu;
                            }
                        }

                        if (!user.is_admin) {
                            if (user.verified_at && item.for === "user/verified") {
                                return SidebarMenu;
                            }
                        }

                        
                    })
                }
            </SidebarMenu>
        </SidebarGroup>
    );
}
