"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/platform-icon";
import CopyButton from "@/components/shared/CopyButton";
import { MultiActionButton, ActionItem } from "@/components/shared/MultiActionButton";
import { getPlatform, platformAction, platformSubtitle } from "@/lib/social-platforms";

// ── Types ──────────────────────────────────────────────────────────────────

type Link = { url: string; title?: string; platform: string };

// ── Helpers ────────────────────────────────────────────────────────────────



const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

// ── Group links by platform ────────────────────────────────────────────────
// Returns an ordered list of entries preserving first-seen order.
// Each entry is either a single link or a group of duplicates.

type SingleEntry = { type: "single"; link: Link };
type GroupEntry = { type: "group"; platform: string; links: Link[] };
type Entry = SingleEntry | GroupEntry;

function groupLinks(links: Link[]): Entry[] {
    const seen: Record<string, Link[]> = {};
    const order: string[] = [];

    for (const link of links) {
        if (!seen[link.platform]) {
            seen[link.platform] = [];
            order.push(link.platform);
        }
        seen[link.platform].push(link);
    }

    return order.map((platform) => {
        const group = seen[platform];
        return group.length === 1
            ? { type: "single", link: group[0] }
            : { type: "group", platform, links: group };
    });
}

// ── Single link button ─────────────────────────────────────────────────────

function SingleLinkButton({ link }: { link: Link }) {
    const platform = getPlatform(link.platform);
    const action = platformAction(link.platform, link.url);

    return (
        <div className="w-full flex items-center gap-2">
            <div
                className="flex-1 flex items-center gap-3 justify-center"
                onClick={action}
            >
                <PlatformIcon name={platform.icon} className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.title || platform.label}</span>
            </div>

            <CopyButton url={link.url} />
        </div>
    );
}

// ── Grouped link button ────────────────────────────────────────────────────

function GroupLinkButton({ platform: platformKey, links }: { platform: string; links: Link[] }) {
    const platform = getPlatform(platformKey);

    const items: ActionItem[] = links.map((l, i) => ({
        id: `${platformKey}-${i}`,
        label: l.title || `${platform.label} ${i + 1}`,
        subtitle: platformSubtitle(l.platform, l.url),
        icon: <PlatformIcon name={platform.icon} className="w-4 h-4" />,
        action: platformAction(l.platform, l.url),
    }));

    return (
        <MultiActionButton
            items={items}
            trigger={{
                label: platform.label,
                multiLabel: platform.label,
                icon: <PlatformIcon name={platform.icon} className="w-4 h-4 shrink-0" />,
                size: "lg",
            }}
            dialog={{
                title: platform.label,
                icon: <PlatformIcon name={platform.icon} className="w-4 h-4 text-muted-foreground" />,
            }}
        />
    );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function LinkButtons({ links }: { links: Link[] }) {
    if (!links.length) return null;

    const entries = groupLinks(links);

    return (
        <div className="w-full flex flex-col gap-3">
            {entries.map((entry, i) => (
                <motion.div
                    key={entry.type === "single" ? entry.link.url : entry.platform}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="w-full"
                >
                    {entry.type === "single" ? (
                        <SingleLinkButton link={entry.link} />
                    ) : (
                        <GroupLinkButton platform={entry.platform} links={entry.links} />
                    )}
                </motion.div>
            ))}
        </div>
    );
}