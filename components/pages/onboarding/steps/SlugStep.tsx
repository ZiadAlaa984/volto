"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/onboarding";
import CardFooterSteps from "../CardFooterSteps";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } },
});

export function SlugStep({ formData, onNext, onBack }: StepProps) {
  const [slug, setSlug] = useState(formData.slug);

  const isValid = slug.trim() !== "";

  const handleNext = () => {
    if (isValid) onNext({ slug });
  };

  return (
    <Card className="rounded-3xl shadow-md border w-full">
      <CardHeader>
        <CardTitle>Choose your username</CardTitle>
        <CardDescription>
          Pick a unique slug for your public profile URL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div {...fadeInUp(0)} className="space-y-2">
          <Label htmlFor="slug">Username / Slug</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm select-none shrink-0">
              yoursite.com/
            </span>
            <Input
              id="slug"
              placeholder="john-doe"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </motion.div>

        {/* Live preview */}
        <motion.div
          {...fadeInUp(0.08)}
          className="rounded-xl bg-muted/50 border border-dashed px-4 py-3"
        >
          <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
            Preview
          </p>
          <motion.p
            key={slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-muted-foreground italic leading-relaxed"
          >
            {slug.trim() === "" ? (
              "Your public profile URL hasn't been set yet."
            ) : (
              <>
                Your profile will be at{" "}
                <span className="font-semibold text-foreground not-italic">
                  /{slug}
                </span>
                .
              </>
            )}
          </motion.p>
        </motion.div>
      </CardContent>
      <CardFooterSteps onNext={handleNext} isValid={isValid} isFirstStep />{" "}
    </Card>
  );
}
