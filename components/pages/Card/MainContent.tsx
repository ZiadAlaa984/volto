"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CardType } from "@/types/onboarding";
import { SOCIAL_KEYS } from "@/lib/social-platforms";
import ProfileHeader from "./ProfileHeader";
import LinkButtons from "./LinkButtons";
import SocialIcons from "./SocialIcons";
import QrCodeTrigger from "./QrCodeTrigger";
import CardFooter from "./CardFooter";
import QrCodeModal from "./QrCodeModal";
import { BusinessType } from "@/types/business";
import Locations from "./Locations";

const cardVariant = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function MainContent({ CardData, businessData }: { CardData: CardType; businessData: BusinessType | null }) {
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
                <Card className="md:max-w-[400px] h-screen md:h-full min-h-[600px] rounded-none md:rounded-xl w-full flex items-start justify-center py-12 px-4">
                    <div className="w-full flex flex-col items-center gap-6">
                        <ProfileHeader CardData={CardData} businessData={businessData} />

                        <LinkButtons links={otherLinks} />
                        {businessData?.locations && <Locations locations={businessData?.locations} />}
                        <SocialIcons links={socialMedia} />
                        <QrCodeTrigger onOpen={() => setQrOpen(true)} />
                        <CardFooter />

                    </div>
                </Card>
            </motion.div>

            <QrCodeModal
                open={qrOpen}
                onOpenChange={setQrOpen}
                url={profileUrl}
                username={CardData?.user_name ?? "user"}
            />
        </>
    );
}