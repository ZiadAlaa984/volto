"use client"
import { useState, ReactNode } from 'react'
import { ChevronRight, Check, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import CopyButton from './CopyButton'

// ── Types ──────────────────────────────────────────────────────────────────

export type ActionItem = {
    id: string
    label: string
    subtitle?: string
    icon?: ReactNode
    color?: {
        bg: string       // e.g. 'bg-emerald-50'
        text: string     // e.g. 'text-emerald-600'
        border: string   // e.g. 'border-emerald-100'
    }
    action: () => void
}

export type MultiActionButtonProps = {
    /** Items to show. 1 item → direct button. 2+ → opens dialog. */
    items: ActionItem[]

    /** The trigger button config */
    trigger: {
        label: string
        icon?: ReactNode
        /** Override label when multiple items exist. Defaults to trigger.label */
        multiLabel?: string
        className?: string
        size?: 'sm' | 'default' | 'lg'
        variant?: 'default' | 'outline' | 'ghost' | 'secondary'
    }

    /** Dialog header config */
    dialog?: {
        title?: string
        icon?: ReactNode
    }

    /** Full control over each item row in the dialog */
    renderItem?: (item: ActionItem, index: number) => ReactNode
}



// ── Default item row ───────────────────────────────────────────────────────

function DefaultItemRow({ item, index, onClose }: {
    item: ActionItem
    index: number
    onClose: () => void
}) {

    return (
        <div className='flex items-center gap-2'>
            <div
                onClick={() => { item.action(); onClose() }}
                className={`
                w-full flex cursor-pointer items-center gap-3 p-3.5 rounded-xl border
                 duration-150 text-left
            `}
            >
                {item.icon && (
                    <div className={`
                    w-9 h-9 rounded-lg flex items-center justify-center
                    bg-white/70 shrink-0
                `}>
                        {item.icon}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate `}>
                        {item.label}
                    </p>
                    {item.subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {item.subtitle}
                        </p>
                    )}
                </div>
                <CopyButton url={item.action.toString()} />
            </div>
        </div>
    )
}

// ── Main shared component ──────────────────────────────────────────────────

export function MultiActionButton({
    items,
    trigger,
    dialog,
    renderItem,
}: MultiActionButtonProps) {
    const [open, setOpen] = useState(false)

    if (!items.length) return null

    const isSingle = items.length === 1
    const buttonLabel = isSingle
        ? trigger.label
        : (trigger.multiLabel ?? trigger.label)

    function handleClick() {
        if (isSingle) {
            items[0].action()
        } else {
            setOpen(true)
        }
    }

    return (
        <>
            <Button
                size={trigger.size ?? 'lg'}
                variant={trigger.variant ?? 'default'}
                className={`w-full flex items-center gap-3 justify-center ${trigger.className ?? ''}`}
                onClick={handleClick}
            >
                {trigger.icon}
                <span className="truncate">{buttonLabel}</span>
                {!isSingle && (
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
                )}
            </Button>

            {!isSingle && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-sm p-0 overflow-hidden gap-0">
                        {(dialog?.title || dialog?.icon) && (
                            <DialogHeader className="px-5 pt-5 pb-3">
                                <DialogTitle className="flex items-center gap-2 text-base">
                                    {dialog.icon}
                                    {dialog.title}
                                </DialogTitle>
                            </DialogHeader>
                        )}

                        <div className="px-4 pb-5 pt-4 flex flex-col gap-3">
                            {items.map((item, i) =>
                                renderItem
                                    ? renderItem(item, i)
                                    : (
                                        <DefaultItemRow
                                            key={item.id}
                                            item={item}
                                            index={i}
                                            onClose={() => setOpen(false)}
                                        />
                                    )
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

// ── Action helpers (use in parent) ─────────────────────────────────────────

/** Opens a URL in a new tab */
export function openUrl(url: string) {
    return () => window.open(url, '_blank', 'noopener,noreferrer')
}

/** Copies text to clipboard. Returns a promise. */
export async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
}

/** Wraps any custom function as an action */
export function customHandler(fn: () => void) {
    return fn
}