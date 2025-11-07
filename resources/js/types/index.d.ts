import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { PageProps } from "@inertiajs/core";

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    for?: "all" | "admin" | "user/verified" | "user/unverified"
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Penalty {
    id: number;
    user_id: number;
    document_request_id: number;
    reason: number;
    created_at: string;
    updated_at: string;
}

export interface Appeal {
    'id': number;
    'penalty_id': number;
    'reason': string;
    'status': string;
    'penalty': Penalty;
    'created_at': string;
    'user': User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    number: string;
    sitio: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    is_admin: boolean;
    penalties: Penalty[];
    [key: string]: unknown; // This allows for additional properties...
}


export interface DocumentRequest {
  id: number;
  user_id: number;
  document_type: string;
  notes: string;
  user_name?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Ready for Pickup' | 'Declined' | 'Completed'
  created_at: string;
  update_at: string;
  user?: User;
  [key: string]: any;
}

export interface ActivityLog {
    id: number;
    user_id: number;
    document_request_id: number;
    reason: string | null;
    created_at: string;
    user?: User[];
    user_name?: string;
}



export interface PaginationLink {
    active: boolean,
    label: string,
    url: string | null,
    [key:string]: unknown
}

export interface Pagination<T = unknown> {
    data: T[],
    links: PaginationLink[]
    [key:string]: unknown
} 


export interface MyPageProps extends PageProps {
    auth: {
        user: User
    }
    [key: string]: unknown
}


export interface Document {
    type: string; // unique identifier for the document
    description?: string | null; // nullable field
    price: number; // default 0.00
    information: string | object; // JSON field
}