"use client"
import { useState } from 'react'
import { Control } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LinkIcon, UploadIcon } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InfoFormValues } from '@/lib/Schema/InfoBusiness'
import FileUpload from '@/components/shared/FileUpload'

interface MenuSectionProps {
    control: Control<InfoFormValues>
}

function MenuSection({ control }: MenuSectionProps) {
    const [tab, setTab] = useState<'link' | 'upload'>('link')

    return (
        <FormField
            control={control}
            name="menu"
            render={({ field, fieldState }) => (
                <FormItem>
                    <Tabs
                        value={tab}
                        onValueChange={v => {
                            setTab(v as 'link' | 'upload')
                            field.onChange(null) // reset value on tab switch
                        }}
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value="link" className="flex-1 gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Link
                            </TabsTrigger>
                            <TabsTrigger value="upload" className="flex-1 gap-2">
                                <UploadIcon className="w-4 h-4" />
                                Upload
                            </TabsTrigger>
                        </TabsList>

                        {/* ── Link tab ── */}
                        <TabsContent value="link" className="space-y-2 pt-2">
                            <FormLabel>Menu URL</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://your-menu-link.com"
                                    value={typeof field.value === 'string' ? field.value : ''}
                                    onChange={e => field.onChange(e.target.value)}
                                    className={
                                        fieldState.isDirty && !fieldState.error && field.value
                                            ? 'border-emerald-500 focus-visible:ring-emerald-500'
                                            : ''
                                    }
                                />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                                Paste a link — website, Zomato, Talabat, Google Drive, etc.
                            </p>
                            <FormMessage />
                        </TabsContent>

                        {/* ── Upload tab ── */}
                        <TabsContent value="upload" className="pt-2">
                            <FormLabel className="mb-2 block">Menu file</FormLabel>
                            <FileUpload
                                accept="image/*,application/pdf"
                                maxSizeMB={20}
                                value={field.value instanceof File ? field.value : null}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            />
                        </TabsContent>
                    </Tabs>
                </FormItem>
            )}
        />
    )
}

export default MenuSection