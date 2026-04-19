import { ActionItem, MultiActionButton, openUrl } from "@/components/shared/MultiActionButton"
import { MenuItemType } from "@/types/business"
import { FileText, LinkIcon, UtensilsCrossed } from "lucide-react"

export function MenuSection({ menus }: { menus: MenuItemType[] | null }) {
    if (!menus?.length) return null

    const items: ActionItem[] = menus.map((m, i) => ({
        id: `menu-${i}`,
        label: m.label || `Menu ${i + 1}`,
        subtitle: m.type === 'file' ? 'PDF file' : 'View online',
        icon: m.type === 'file'
            ? <FileText className="w-4 h-4" />
            : <LinkIcon className="w-4 h-4" />,
        action: openUrl(m.value),
    }))

    return (
        <MultiActionButton
            items={items}
            trigger={{
                label: items[0].label,
                multiLabel: 'View Menus',
                icon: <UtensilsCrossed className="w-4 h-4 shrink-0" />,
            }}
            dialog={{
                title: 'Our Menus',
                icon: <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />,
            }}
        />
    )
}