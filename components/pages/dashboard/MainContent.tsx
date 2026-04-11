"use client"
import { useCallback, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import useDetectBrowser from "@/hooks/use-detect-browser"
import useScreenSize from "@/hooks/use-screen-size"
import GooeySvgFilter from "@/components/fancy/filter/gooey-svg-filter"
import { CreditCard, Link, Settings } from "lucide-react"
import SettingTab from "./TabsContent/Setting/SettingTab"
import InfoCardTab from "./TabsContent/InfoCard/InfoCardTab"
import LinksTab from "./TabsContent/Links/LinksTab"
import { useCard } from "@/hooks/useCard"
import { CardType } from "@/types/onboarding"

const TAB_SLUGS = ["info-card", "links", "settings"] as const
type TabSlug = typeof TAB_SLUGS[number]

export default function GooeyDemo() {
    const { deleteCard, isPending, hasCard, cardData, isLoadingCard, updateCard } = useCard();

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const screenSize = useScreenSize()
    const browserName = useDetectBrowser()
    const isSafari = browserName === "Safari"

    const TAB_CONTENT = useMemo(() => [
        { slug: "info-card", title: "Info Card", icon: CreditCard, content: <InfoCardTab cardData={cardData as CardType} isLoadingCard={isLoadingCard} isUpdating={isPending} updateCard={updateCard} /> },
        ...(cardData ? [{ slug: "links", title: "Links", icon: Link, content: <LinksTab cardId={cardData?.id || ""} /> }] : []),
        { slug: "settings", title: "Settings", icon: Settings, content: <SettingTab hasCard={hasCard} isLoadingCard={isLoadingCard} cardData={cardData as CardType} deleteCard={deleteCard} isPending={isPending} /> },
    ], [cardData, hasCard, isLoadingCard, deleteCard, isPending, updateCard])


    const tabSlug = searchParams.get("tab")
    const resolvedTab = Math.max(0, TAB_CONTENT.findIndex(t => t.slug === tabSlug))

    const setActiveTab = useCallback((index: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", TAB_CONTENT[index].slug)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [router, pathname, searchParams, TAB_CONTENT])



    return (
        <div className="relative min-h-[700px] flex justify-center font-calendas md:text-base text-xs sm:text-sm">
            <GooeySvgFilter id="gooey-filter" strength={screenSize.lessThan("md") ? 8 : 15} />

            <div className="w-full relative">
                <div className="absolute inset-0" style={{ filter: "url(#gooey-filter)" }}>
                    <div className="flex flex-col">
                        <div className="flex w-full">
                            {TAB_CONTENT.map((_, index) => (
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

                        <div className="w-full overflow-hidden bg-card rounded-b-xl">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={resolvedTab}
                                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="p-8 md:p-12 bg-card"
                                >
                                    <div className="space-y-2 mt-4 sm:mt-8 md:mt-8">
                                        {TAB_CONTENT[resolvedTab].content}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="relative flex w-full">
                    {TAB_CONTENT.map((tab, index) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className="flex-1 h-8 md:h-12"
                            >
                                <span className={`w-full h-full flex items-center justify-center gap-1.5 ${resolvedTab === index ? "text-primary" : "text-muted-foreground"}`}>
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