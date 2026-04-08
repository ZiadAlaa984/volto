"use client";

import { Card, CardContent } from "./ui/card";
import { motion, Easing } from "framer-motion";
import Image from "next/image";
import heroImage from "@/app/circle-light-mode.svg";
import ButtonDemo from "./shared/ButtonDemo";
import Link from "next/link";
import { useCard } from "@/hooks/useCard";
import { Skeleton } from "./ui/skeleton";

// Shared fade-up variant factory
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as unknown as Easing[], delay },
});

export default function Hero() {
  const { hasCard, isLoadingCard } = useCard();


  return (
    <Card className="relative w-full py-6 min-h-[700px]   overflow-hidden flex flex-col ">
      <CardContent >

        <div className="relative z-10  flex flex-col gap-6 justify-center items-center ">
          {/* Badge */}
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border backdrop-blur-sm px-4 py-1.5 text-xs font-medium  shadow-sm "
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            The link-in-bio tool for creators
          </motion.div>

          {/* Headline — uses Outfit via --font-sans */}
          <motion.h2
            {...fadeUp(0.1)}
            className=" capitalize leading-[1.06] text-center tracking-[-0.04em] mb-5 text-7xl"
          >
            Volto — One link.<br />
            Everything you are.
          </motion.h2>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.2)}
            className="max-w-md text-base text-center leading-relaxed"
          >
            Volto provides a single page for your audience — a summary of your work in
            one place, including your links, your content, and your identity.
          </motion.p>

          {/* Buttons */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex items-center gap-3 flex-wrap justify-center"
          >
            <Link href={hasCard ? "/protected/dashboard" : "/protected/onboarding"}>
              <ButtonDemo>
                {isLoadingCard ? <Skeleton className="h-10 w-40" /> :
                  hasCard ? "Go to Dashboard" : "Get Started Free"}
              </ButtonDemo>
            </Link>

          </motion.div>
        </div>


        {/* ── Hero Image — fade in + slide up ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full  left-0 absolute bottom-0"
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as unknown as Easing[], delay: 0.45 }}
        >
          <Image
            src={heroImage}
            alt="Volto — your link-in-bio page preview"
            className="w-full h-auto"
            width={500}
            height={200}
          />
        </motion.div>
      </CardContent>

    </Card >
  );
}