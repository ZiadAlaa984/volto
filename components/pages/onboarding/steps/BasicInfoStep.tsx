"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StepProps } from "@/types/onboarding";
import CardFooterSteps from "../CardFooterSteps";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } },
});

export function BasicInfoStep({ formData, onNext, onBack }: StepProps) {
  const [name, setName] = useState(formData.name);
  const [bio, setBio] = useState(formData.bio);

  const isValid = name.trim() !== "";

  const handleNext = () => {
    if (isValid) onNext({ name, bio });
  };

  return (
    <Card className="rounded-3xl shadow-md border w-full">
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
        <CardDescription>Tell the world who you are.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <motion.div {...fadeInUp(0)} className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </motion.div>

        <motion.div {...fadeInUp(0.08)} className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="A short intro about yourself…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-[80px] transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </motion.div>

        {/* Live preview */}
        <motion.div
          {...fadeInUp(0.16)}
          className="rounded-xl bg-muted/50 border border-dashed px-4 py-3 space-y-1"
        >
          <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
            Preview
          </p>
          <motion.p
            key={`n-${name}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground italic"
          >
            {name.trim() === "" ? (
              "You haven't set a display name yet."
            ) : (
              <>
                Your name is{" "}
                <span className="font-semibold text-foreground not-italic">
                  {name}
                </span>
                .
              </>
            )}
          </motion.p>
          <motion.p
            key={`b-${bio}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
            className="text-sm text-muted-foreground italic"
          >
            {bio.trim() === "" ? (
              "No bio written yet."
            ) : (
              <>
                Bio: <span className="text-foreground not-italic">"{bio}"</span>
              </>
            )}
          </motion.p>
        </motion.div>
      </CardContent>

      <CardFooterSteps
        onBack={onBack}
        onNext={handleNext}
        isValid={isValid}
      />
    </Card>
  );
}
