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
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="Instagram, TikTok, YouTube, facebook..."
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