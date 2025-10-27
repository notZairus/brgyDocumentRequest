import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import type { ActivityLog } from "@/types/index.d.ts";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns";


export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-foreground hover:bg-transparent w-full flex justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="flex px-4 font-medium">{row.getValue('id')}</div>
    },
  },
  {
    accessorKey: "admin_name",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-foreground hover:bg-transparent w-full flex justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Admin
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">{ row.getValue('admin_name') }</div>
    )
  },
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-foreground hover:bg-transparent w-full flex justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Action
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">{ row.getValue('action') }</div>
    )
  },
  {
    accessorKey: "reason",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-foreground hover:bg-transparent w-full flex justify-center"
        >
          Reason
        </Button>
      )
    },
    cell: ({ row }) => {
      const action = row.getValue('action');
      let message = "N/A";

      if (action === 'Approved') {
        message = "Valid Request";
      } else {
        message = row.getValue('reason') ? row.getValue('reason') : "N/A";
      }

      return <div className="max-w-[200px] overflow-hidden text-wrap text-center">{message}</div>
    },
  },
  {
    accessorKey: "document_request_id",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-foreground hover:bg-transparent w-full flex justify-center"
        >
          Document ID
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('document_request_id') ? row.getValue('document_request_id') : "N/A"}</div>
    },
  },
  {
    accessorKey: "user_name",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-foreground hover:bg-transparent w-full flex justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Resident
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">{ row.getValue('user_name') }</div>
    )
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent text-foreground hover:bg-transparent w-full flex justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Commit Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center">{format(row.getValue('created_at'), "MMMM d, yyyy")}</div>
    },
  },
]