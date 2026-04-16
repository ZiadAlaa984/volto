import z from "zod"

// ── Reusable validators ────────────────────────────────────────────────────

export const urlOrEmpty = z.string().refine(
    val => val === '' || z.string().url().safeParse(val).success,
    { message: 'Please enter a valid URL' }
)

// ── Schemas ────────────────────────────────────────────────────────────────

export const dayHoursSchema = z.object({
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    closed: z.boolean(),
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

export const menuSchema = z.union([
    z.object({
        type: z.enum(["text", "file"]),
        value: z.string(),
    }),
    z.instanceof(File),
]).nullable()

export const formSchema = z.object({
    opening_hours: openingHoursSchema,
    locations: z.array(locationSchema).max(3),
    menu: menuSchema,
    video_url: urlOrEmpty,
})

// ── Types ──────────────────────────────────────────────────────────────────

export type DayHours = z.infer<typeof dayHoursSchema>
export type OpeningHours = z.infer<typeof openingHoursSchema>
export type Location = z.infer<typeof locationSchema>
export type MenuValue = z.infer<typeof menuSchema>
export type InfoFormValues = z.infer<typeof formSchema>

// ── Defaults ───────────────────────────────────────────────────────────────

export const DEFAULT_HOURS: OpeningHours = [
    { day: 'Monday', closed: false, open: '09:00', close: '18:00' },
    { day: 'Tuesday', closed: false, open: '09:00', close: '18:00' },
    { day: 'Wednesday', closed: false, open: '09:00', close: '18:00' },
    { day: 'Thursday', closed: false, open: '09:00', close: '18:00' },
    { day: 'Friday', closed: false, open: '09:00', close: '17:00' },
    { day: 'Saturday', closed: true },
    { day: 'Sunday', closed: true },
]