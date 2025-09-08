import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePage } from '@inertiajs/react';
import { PageProps } from "@inertiajs/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"



interface MyProps {
    flash: {
        success: string,
        error: {
            message: string,
            penalty_id?: number
        }
    }
};




export default function AppealReasonDialog({ penalty_id, message }: { penalty_id?: number, message?: string }) {
    const [appealReason, setAppealReason] = useState('');

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="cursor-pointer">Appeal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Appeal Active Penalty</DialogTitle>
                    <DialogDescription>
                        You currently have an active penalty. If you believe this is a mistake or wish to appeal, please provide a detailed reason below. Your appeal will be reviewed by the barangay staff.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="appeal_reason">Reason</Label>
                        <Textarea 
                            id="appeal_reason" 
                            value={appealReason} 
                            onChange={(e) => setAppealReason(e.target.value)} 
                            placeholder="Provide your reason for appealing the penalty..." 
                            required 
                            minLength={10}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Link preserveScroll href={`/appeals`} method="post" data={{ penalty_id: penalty_id, reason: appealReason }} >
                            <Button>Confirm</Button>
                        </Link>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
