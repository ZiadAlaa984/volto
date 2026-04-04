"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlugStep } from "./steps/SlugStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { LinksStep } from "./steps/Links/LinksStep";
import { CardType } from "@/types/onboarding";
import { useCard } from "@/hooks/useCard";
import { useAuth } from "@/context/AuthContext";
import { stepVariants } from "@/lib/Animation/stepVariants";

const STEP_COMPONENTS = [
  { key: "slug", label: "Slug", Component: SlugStep },
  { key: "basic-info", label: "Basic Info", Component: BasicInfoStep },
  { key: "links", label: "Links", Component: LinksStep },
] as const;

const INITIAL_FORM_DATA: CardType = {
  user_name: "",
  name: "",
  bio: "",
  links: [{ title: "", url: "", platform: "" }],
};

export default function OnboardingPage() {
  const { session } = useAuth();
  const { checkHasCard } = useCard();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CardType>(INITIAL_FORM_DATA);

  useEffect(() => {
    if (session?.user?.id) {
      checkHasCard(session.user.id);
    }
  }, [session]);

  const handleNext = (data?: Partial<CardType>) => {
    if (data) setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => Math.min(prev + 1, STEP_COMPONENTS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const steps = STEP_COMPONENTS.map(({ key, Component }, index) => {
    const isLastStep = index === STEP_COMPONENTS.length - 1;
    return (
      <Component
        key={key}
        formData={formData}
        onNext={handleNext}
        onBack={handleBack}
        {...(isLastStep && { onFinish: true })}
      />
    );
  });

  const progress = (currentStep / (STEP_COMPONENTS.length - 1)) * 100;

  return (
    <div className="w-full max-w-lg mx-auto py-8 flex flex-col gap-6">

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-between">
          {STEP_COMPONENTS.map(({ key, label }, index) => {
            const isPast = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <motion.div
                key={key}
                className="flex flex-col items-center gap-1.5"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className={[
                    "w-4 h-4 rounded-full transition-colors duration-300",
                    isPast ? "bg-primary cursor-pointer" : "",
                    isCurrent ? "bg-primary ring-4 ring-primary/20" : "",
                    !isPast && !isCurrent ? "bg-muted" : "",
                  ].join(" ")}
                  onClick={() => isPast && setCurrentStep(index)}
                  whileTap={{ scale: 0.95 }}
                />
                <span
                  className={[
                    "text-xs hidden sm:block",
                    isCurrent ? "text-primary font-medium" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
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
          {steps[currentStep]}
        </motion.div>
      </AnimatePresence>

      {/* Step counter */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Step {currentStep + 1} of {STEP_COMPONENTS.length}
      </motion.p>
    </div>
  );
}