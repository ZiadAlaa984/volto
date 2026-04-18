"use client"
import { useCallback } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import useDetectBrowser from "@/hooks/use-detect-browser"
import useScreenSize from "@/hooks/use-screen-size"
import GooeySvgFilter from "@/components/fancy/filter/gooey-svg-filter"
import { LucideIcon } from "lucide-react"

export interface GooeyTab {
    slug: string
    title: string
    icon: LucideIcon
    content: React.ReactNode
}

interface GooeyTabsProps {
    tabs: GooeyTab[]
    /** Extra padding inside the content panel. Defaults to "p-4 md:p-12" */
    contentPadding?: string
}

export default function GooeyTabs({ tabs, contentPadding = "p-4 md:p-12" }: GooeyTabsProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const screenSize = useScreenSize()
    const browserName = useDetectBrowser()
    const isSafari = browserName === "Safari"

    const tabSlug = searchParams.get("tab")
    const resolvedTab = Math.max(0, tabs.findIndex((t) => t.slug === tabSlug))

    const setActiveTab = useCallback(
        (index: number) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("tab", tabs[index].slug)
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [router, pathname, searchParams, tabs]
    )

    return (
        <div className="relative min-h-screen flex flex-col font-calendas md:text-base text-xs sm:text-sm">
            <GooeySvgFilter id="gooey-filter" strength={screenSize.lessThan("md") ? 8 : 15} />

            <div className="w-full flex flex-col flex-1 relative">
                <div className="absolute inset-0" style={{ filter: "url(#gooey-filter)" }}>
                    <div className="flex flex-col">
                        {/* Animated active-tab indicator */}
                        <div className="flex w-full">
                            {tabs.map((_, index) => (
                                <div key={index} className="relative flex-1 h-8 md:h-12">
                                    {resolvedTab === index && (
                                        <motion.div
                                            layoutId="active-tab"
                                            className="absolute inset-0 bg-card"
                                            transition={{
                                                type: "spring",
                                                bounce: 0.0,
                                                duration: isSafari ? 0 : 0.4,
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Tab content panel */}
                        <div className={`w-full overflow-hidden bg-card rounded-b-xl flex-1 flex flex-col`}>
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={resolvedTab}
                                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className={`${contentPadding} bg-card`}
                                >
                                    <div className="space-y-2 mt-4 sm:mt-8 md:mt-8 py-6">
                                        {tabs[resolvedTab].content}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Clickable tab bar */}
                <div className="relative flex w-full">
                    {tabs.map((tab, index) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className="flex-1 h-8 md:h-12"
                            >
                                <span
                                    className={`w-full h-full flex items-center justify-center gap-1.5 ${resolvedTab === index ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    {tab.title}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}