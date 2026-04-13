"use client"
import { Control } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InfoFormValues } from '@/lib/Schema/InfoBusiness'

interface VideoSectionProps {
    control: Control<InfoFormValues>
}

function VideoSection({ control }: VideoSectionProps) {
    return (
        <FormField
            control={control}
            name="video_url"
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="YouTube, Vimeo, Instagram, TikTok..."
                            className={
                                fieldState.isDirty && !fieldState.error
                                    ? 'border-emerald-500 focus-visible:ring-emerald-500'
                                    : ''
                            }
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default VideoSection