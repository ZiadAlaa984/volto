import { CardInfoFormValues, CardInfoSchema } from "@/lib/Schema/CardInfoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fadeInUp } from "@/lib/Animation/stepVariants";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { useCard } from "@/hooks/useCard";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toastShared } from "@/lib/utils";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import Router from "@/lib/route";

function InfoCardTab() {
    const { cardData, isLoadingCard, updateCard, isUpdating } = useCard();
    const router = useRouter();

    const form = useForm<CardInfoFormValues>({
        resolver: zodResolver(CardInfoSchema),
        defaultValues: {
            name: cardData?.name || "",
            bio: cardData?.bio || "",
            profile_picture: cardData?.profile_picture || null,
        },
        values: cardData ? {
            name: cardData.name || "",
            bio: cardData.bio || "",
            profile_picture: cardData.profile_picture || null,
        } : undefined,
        mode: "onChange",
    });

    const onSubmit = (data: CardInfoFormValues) => {
        if (!cardData?.id) return;
        if (!form.formState.isDirty || !form.formState.isValid) {
            toastShared({
                title: "No changes detected or form is invalid",
                description: "No changes detected or form is invalid",
                variant: "info",
            });
            return;
        }

        updateCard({
            cardId: cardData.id,
            data,
            // Pass the current stored URL so the mutation knows what to delete
            // Will be undefined if user never had a profile picture
            currentProfilePicture:
                typeof cardData.profile_picture === "string"
                    ? cardData.profile_picture
                    : null,
        });
    };

    if (isLoadingCard || cardData === undefined) {
        return <Loading />;
    }


    if (!cardData) {
        return (
            <div className="flex items-center justify-center h-full">
                <Button onClick={() => router.push(Router.ONBOARDING)}>
                    Create Card
                </Button>
            </div>
        );
    }


    return (
        <Card className="rounded-3xl shadow-md border w-full">
            <CardHeader>
                <CardTitle>Info</CardTitle>
                <CardDescription>Update your information</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div {...fadeInUp(0)} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ziad Alaa" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div {...fadeInUp(0.08)} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="A short intro about yourself…"
                                                className="min-h-[80px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>


                        <Button
                            type="submit"
                            disabled={!form.formState.isValid || !form.formState.isDirty || isUpdating}
                            className="rounded-2xl gap-1"
                        >
                            {isUpdating ? <Loader className="animate-spin" /> : "Save"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default InfoCardTab;