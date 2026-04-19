"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CardType } from "@/types/onboarding";
import { SOCIAL_KEYS } from "@/lib/social-platforms";
import ProfileHeader from "./ProfileHeader";
import logo from "@/app/logo.svg"
import LinkButtons from "./LinkButtons";

import { BusinessType } from "@/types/business";
import { ReviewsResult } from "@/services/queries/getReviews";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import ShareDialog from "./QrCodeModal";
import { DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import VideoSection from "./VideoSection";
import Reviews from "./Review/Reviews";
import { MenuSection } from "./MenuSection";
import LocationSection from "./LocationSection";

const cardVariant = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function MainContent({ CardData, businessData, reviews }: { CardData: CardType; businessData: BusinessType | null; reviews: ReviewsResult | null }) {
    const [qrOpen, setQrOpen] = useState(false);

    const socialLinks = CardData?.links ?? [];
    const socialMedia = socialLinks.filter((l) => SOCIAL_KEYS.includes(l.platform));
    const otherLinks = socialLinks.filter((l) => !SOCIAL_KEYS.includes(l.platform));

    const profileUrl =
        typeof window !== "undefined"
            ? window.location.href
            : `https://volto.com/${CardData?.user_name ?? ""}`;

    return (
        <>
            <motion.div
                variants={cardVariant}
                initial="hidden"
                animate="show"
                className="flex justify-center items-start w-full"
            >
                <Card className="md:max-w-[400px] flex flex-col overflow-hidden min-h-screen md:h-full rounded-none md:rounded-xl w-full  ">
                    <CardHeader className="flex flex-row items-center w-full justify-between">
                        <Link href="/">
                            <Button size={"icon"} variant={"outline"}>
                                <Image width={18} height={18} className="object-cover" src={logo} alt="logo" />
                            </Button>
                        </Link>

                        <ShareDialog
                            open={qrOpen}
                            onOpenChange={setQrOpen}
                            url={profileUrl}
                            username={CardData?.user_name ?? "user"}
                            displayName={CardData?.name ?? CardData?.user_name ?? "User"}
                            profile_picture={CardData?.profile_picture as string || ""}
                        >
                            <DialogTrigger asChild>
                                <Button size={"icon"} variant={"outline"}>
                                    <Share />
                                </Button>
                            </DialogTrigger>
                        </ShareDialog>

                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <ProfileHeader socialMedia={socialMedia} CardData={CardData} businessData={businessData} />
                        <LinkButtons links={otherLinks} />
                        {businessData?.menu && <MenuSection menus={businessData.menu} />}
                        {businessData?.locations && <LocationSection locations={businessData.locations} />}
                        <VideoSection src={businessData?.video_url || ""} />
                        {reviews && <Reviews reviews={reviews} cardId={CardData?.id || ""} activeReviews={businessData?.active_reviews || false} />}
                    </CardContent>
                    <CardFooter className="mx-auto">
                        <motion.p
                            className="text-xs pb-4 text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                        >
                            Create your own at{" "}
                            <a
                                href={"./"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors font-bold hover:text-foreground"
                            >
                                Volto
                            </a>
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>

        </>
    );
}