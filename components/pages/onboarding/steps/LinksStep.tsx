"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkItem, StepProps } from "@/types/onboarding";
import CardFooterSteps from "../CardFooterSteps";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } },
});

export function LinksStep({ formData, onNext, onBack }: StepProps) {
  const [links, setLinks] = useState<LinkItem[]>(
    formData.links.length > 0 ? formData.links : [{ title: "", url: "" }],
  );

  const updateLink = (index: number, field: keyof LinkItem, val: string) => {
    setLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const addLink = () => setLinks((prev) => [...prev, { title: "", url: "" }]);
  const removeLink = (index: number) =>
    setLinks((prev) => prev.filter((_, i) => i !== index));

  const validLinks = links.filter((l) => l.title.trim() && l.url.trim());
  const isValid = validLinks.length > 0;

  const handleNext = () => {
    if (isValid) onNext({ links });
  };

  return (
    <Card className="rounded-3xl shadow-md border w-full">
      <CardHeader>
        <CardTitle>Your Links</CardTitle>
        <CardDescription>
          Add the links you want to share on your profile.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Link inputs */}
        <motion.div {...fadeInUp(0)} className="space-y-3">
          <AnimatePresence initial={false}>
            {links.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.05 },
                }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                className="flex gap-2 items-start rounded-xl border p-3"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Link title (e.g. Twitter)"
                    value={link.title}
                    onChange={(e) => updateLink(index, "title", e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Input
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                {links.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 rounded-xl border-dashed"
            onClick={addLink}
          >
            <Plus className="h-4 w-4" /> Add another link
          </Button>
        </motion.div>

        {/* Live preview */}
        <motion.div
          {...fadeInUp(0.08)}
          className="rounded-xl bg-muted/50 border border-dashed px-4 py-3"
        >
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
            Preview
          </p>
          <AnimatePresence initial={false}>
            {validLinks.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground italic"
              >
                No links added yet.
              </motion.p>
            ) : (
              validLinks.map((link, i) => (
                <motion.p
                  key={`${link.title}-${i}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.06 },
                  }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground italic leading-relaxed"
                >
                  <span className="font-semibold text-foreground not-italic">
                    {link.title}
                  </span>
                  {" → "}
                  <span className="text-foreground not-italic underline underline-offset-2">
                    {link.url}
                  </span>
                </motion.p>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>

      <CardFooterSteps
        onBack={onBack}
        onNext={handleNext}
        isValid={isValid}
        isLastStep
      />
    </Card>
  );
}
