"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { StepProps } from "@/types/onboarding";
import CardFooterSteps from "../CardFooterSteps";
import { fadeInUp } from "@/lib/Animation/stepVariants";
import { ProfilePictureSchema } from "@/lib/Schema/ProfilePictureSchema";
import { AvatarUpload } from "@/components/shared/AvatarUpload";

export function ProfilePictureStep({ formData, onNext, onBack }: StepProps) {
    const form = useForm<ProfilePictureSchema>({
        resolver: zodResolver(ProfilePictureSchema),
        defaultValues: {
            profile_picture: formData.profile_picture || null,
        },
        mode: "onChange",
    });

    const handleNext = form.handleSubmit((values) => {
        onNext({ profile_picture: values.profile_picture });
    });

    return (
        <Card className="rounded-3xl shadow-md border w-full">
            <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a photo to personalize your profile.</CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleNext}>
                        <motion.div {...fadeInUp(0)}>
                            <FormField
                                control={form.control}
                                name="profile_picture"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormControl>
                                            <AvatarUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                defaultAvatar={
                                                    typeof formData.profile_picture === "string"
                                                        ? formData.profile_picture
                                                        : undefined
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    </form>
                </Form>
            </CardContent>

            <CardFooterSteps
                onBack={onBack}
                onNext={handleNext}
                isValid={form.formState.isValid}
            />
        </Card>
    );
}