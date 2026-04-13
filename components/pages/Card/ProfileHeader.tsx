"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader } from "@/components/ui/card";
import { CardType } from "@/types/onboarding";
import { BusinessType } from "@/types/business";
import { OpenHoursBadge } from "../business-card/TabContent/InfoBusinessTab/OpenHours/OpenHoursEditor";

function getInitials(name?: string) {
    return name
        ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "?";
}

export default function ProfileHeader({ CardData, businessData }: { CardData: CardType; businessData: BusinessType | null }) {
    return (
        <CardHeader className="flex flex-col items-center gap-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
                <Avatar className="size-28 shadow-xl">
                    <AvatarImage
                        src={(CardData?.profile_picture as string) || ""}
                        className="object-cover"
                        alt={CardData?.name}
                    />
                    <AvatarFallback className="text-2xl font-bold">
                        {getInitials(CardData?.name)}
                    </AvatarFallback>
                </Avatar>
            </motion.div>

            <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            >
                <h1 className="text-4xl capitalize font-semibold tracking-tight">
                    {CardData?.name ?? "Your Name"}
                </h1>
                {CardData?.bio && (
                    <p className="text-xl leading-snug text-muted-foreground">
                        {CardData.bio}
                    </p>
                )}
                {businessData?.opening_hours && (
                    <OpenHoursBadge hours={businessData.opening_hours} />
                )}
            </motion.div>
        </CardHeader>
    );
}