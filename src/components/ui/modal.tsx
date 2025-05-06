"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    children: React.ReactNode
}

export function Modal({ open, onOpenChange, title, description, children }: ModalProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none flex flex-col gap-4"
                    )}
                >
                    <div className="flex items-center justify-between">
                        <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                            {title}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Close asChild>
                            <button
                                className="rounded p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring"
                                aria-label="Close"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </DialogPrimitive.Close>
                    </div>
                    {description ?
                        <DialogPrimitive.Description className="text-muted-foreground text-sm mb-2">
                            {description}
                        </DialogPrimitive.Description>
                        : <DialogPrimitive.Description className="sr-only"> </DialogPrimitive.Description>}
                    <div>{children}</div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
} 