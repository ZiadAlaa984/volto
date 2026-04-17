import z from "zod"

export const urlOrEmpty = z.string().refine(
    val => val === '' || z.string().url().safeParse(val).success,
    { message: 'Please enter a valid URL' }
)

export const dayHoursSchema = z.object({
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    closed: z.boolean(),
    open24h: z.boolean().optional(),
    open: z.string().optional(),
    close: z.string().optional(),
})

export const openingHoursSchema = z.array(dayHoursSchema)

export const locationSchema = z.object({
    id: z.string(),
    type: z.enum(['text', 'maps']),
    title: z.string(),
    address: z.string().optional(),
    maps_url: z.string().optional(),
    lat: z.string().optional(),
    lng: z.string().optional(),
})

// ── Each menu row in the form ──────────────────────────────────────────────
export const menuItemSchema = z.object({
    label: z.string().max(40).optional(),
    content: z.union([
        z.object({ type: z.enum(["text", "file"]), value: z.string() }),
        z.instanceof(File),
        z.null(),
    ]),
    // tracks which tab is active for THIS row
    activeTab: z.enum(["upload", "link"]),
})

export const formSchema = z.object({
    opening_hours: openingHoursSchema,
    locations: z.array(locationSchema).max(3),
    menu: z.array(menuItemSchema).max(3),
    video_url: urlOrEmpty,
})

export type DayHours = z.infer<typeof dayHoursSchema>
export type OpeningHours = z.infer<typeof openingHoursSchema>
export type Location = z.infer<typeof locationSchema>
export type MenuItemValue = z.infer<typeof menuItemSchema>
export type InfoFormValues = z.infer<typeof formSchema>

export const DEFAULT_HOURS: OpeningHours = [
    { day: 'Monday', closed: false, open24h: false, open: '09:00', close: '18:00' },
    { day: 'Tuesday', closed: false, open24h: false, open: '09:00', close: '18:00' },
    { day: 'Wednesday', closed: false, open24h: false, open: '09:00', close: '18:00' },
    { day: 'Thursday', closed: false, open24h: false, open: '09:00', close: '18:00' },
    { day: 'Friday', closed: false, open24h: false, open: '09:00', close: '17:00' },
    { day: 'Saturday', closed: true, open24h: false },
    { day: 'Sunday', closed: true, open24h: false },
]

export const DEFAULT_MENU_ITEM: MenuItemValue = {
    label: "",
    content: null,
    activeTab: "upload",
}