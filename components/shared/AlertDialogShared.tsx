"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toastShared } from "@/lib/utils";
import { useState } from "react";

type Props = {
    title: string;
    description: string;
    actionText: string;
    onClick: () => Promise<void> | void;
    disabled?: boolean;
};

export default function AlertDialogShared({
    actionText,
    title,
    description,
    onClick,
    disabled,
}: Props) {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    async function handleConfirm() {
        setIsPending(true);
        try {
            await onClick(); // ✅ wait for the async operation to finish
            setOpen(false); // ✅ only close after it's done
        } catch {
            toastShared({ title: "Error", description: "Something went wrong", variant: "error" });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={disabled}>
                    {actionText}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

                    {/* ✅ plain Button, NOT AlertDialogAction — no auto-close */}
                    <Button
                        variant="destructive"
                        disabled={isPending || disabled}
                        onClick={handleConfirm}
                    >
                        {isPending ? "Please wait..." : actionText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}