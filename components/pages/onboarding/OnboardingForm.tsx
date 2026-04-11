"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardType } from "@/types/onboarding";
import { useCard } from "@/hooks/useCard";
import { stepVariants } from "@/lib/Animation/stepVariants";
import { useRouter } from "next/navigation";
import Router from "@/lib/route";
import { STEPS, INITIAL_FORM_DATA } from "./Constants";
import { StepDots, ProgressBar } from "./designSteps";



// ─── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { hasCard, isLoadingCard } = useCard();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CardType>(INITIAL_FORM_DATA);
  const router = useRouter();

  const isLastStep = currentStep === STEPS.length - 1;
  const progress = (currentStep / (STEPS.length - 1)) * 100;

  useLayoutEffect(() => {
    if (!isLoadingCard && hasCard) {
      router.push(Router.DASHBOARD.home); // was pushing to ONBOARDING — likely a bug
    }
  }, [hasCard, isLoadingCard, router]);

  const handleNext = (data?: Partial<CardType>) => {
    if (data) setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const { Component: ActiveStep } = STEPS[currentStep];

  return (
    <div className="w-full max-w-lg mx-auto py-8 flex flex-col gap-6">

      {/* Progress tracker */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <StepDots currentStep={currentStep} onNavigate={setCurrentStep} />
        <ProgressBar progress={progress} />
      </motion.div>

      {/* Active step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ActiveStep
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
            {...(isLastStep && { onFinish: true })}
          />
        </motion.div>
      </AnimatePresence>

      {/* Step counter */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Step {currentStep + 1} of {STEPS.length}
      </motion.p>

    </div>
  );
}