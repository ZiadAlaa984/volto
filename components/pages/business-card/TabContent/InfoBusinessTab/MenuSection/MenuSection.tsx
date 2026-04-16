"use client"
import { Control } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InfoFormValues } from '@/lib/Schema/InfoBusiness'
import FileUpload from '@/components/shared/FileUpload'

interface MenuSectionProps {
    control: Control<InfoFormValues>
    activeTab?: 'link' | 'upload'
}

function MenuSection({ control, activeTab }: MenuSectionProps) {

    return (
        <FormField
            control={control}
            name="menu"
            render={({ field, fieldState }) => (
                <FormItem>
                    <Tabs
                        value={activeTab}
                    >
                        {/* ── Link tab ── */}
                        <TabsContent value="link" className="space-y-2 pt-2">
                            <FormLabel>Menu URL</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://your-menu-link.com"
                                    value={typeof field.value === 'string' ? field.value : ''}
                                    onChange={e => field.onChange(e.target.value)}
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