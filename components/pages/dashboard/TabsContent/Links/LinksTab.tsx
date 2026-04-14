import Loading from "@/app/loading";
import { LinksForm } from "@/components/pages/onboarding/steps/Links/LinksForm";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useLinks } from "@/hooks/useLink";
import { useLinkForm } from "@/hooks/useLinkForm";
import Router from "@/lib/route";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function LinksTab({ cardId }: { cardId: string }) {

    const { linksData, syncLinks, isPending, isLoading } = useLinks(cardId);
    const router = useRouter();
    const {
        form,
        fields,
        remove,
        watchedLinks,
        isValid,
        errors,
        handlePlatformChange,
        handleAddLink,
        handleSubmit
    } = useLinkForm({
        defaultLinks: linksData?.data || [],
        values: linksData?.data || [],
        onSubmit: (links) => {
            syncLinks(links);
        },
    });


    if (linksData === undefined || isLoading) {
        return <Loading />;
    }


    if (!linksData) {
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
                <CardTitle>Your Links</CardTitle>
                <CardDescription>Add the links you want to share on your profile.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full">
                    <LinksForm
                        form={form}
                        fields={fields}
                        watchedLinks={watchedLinks}
                        errors={errors}
                        onPlatformChange={handlePlatformChange}
                        onAddLink={handleAddLink}
                        onRemove={remove}
                        onSubmit={handleSubmit}
                    />
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={!isValid || isPending || !form.formState.isDirty}>
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </CardFooter>
        </Card>
    );
}