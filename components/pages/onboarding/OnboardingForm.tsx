"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SlugStep } from "./steps/SlugStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { LinksStep } from "./steps/LinksStep";
import { CardType } from "@/types/onboarding";
import MultiStepLoaderDemo from "@/components/multi-step-loader-demo";
import { useCard } from "@/hooks/useCard";
import { catchAsync } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// ─── Animation ────────────────────────────────────────────────────────────────

export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } },
});

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2, ease: "easeIn" } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { session } = useAuth();
  const { isLoading, checkHaveCard } = useCard();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CardType>({
    user_name: "",
    name: "",
    bio: "",
    links: [{ title: "", url: "", platform: "" }],
  });





  const handleNext = (data?: Partial<CardType>) => {
    if (data) setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Each step receives formData, onNext, onBack as direct props

  // ! if you want to add step
  // ~ add in steps array
  // ~ add title in  Progress dots

  // * explaination how steps work
  // ~ take value from formData and send onNext and onBack in CardFooterSteps
  // ~ when you want to go to second step write  onNext({ YOU WANT TO SEND REF BY formData  }) from props

  // todo add validaton to all steps and in last step send to save and go to page /:slug

  const steps = [
    <SlugStep
      key="slug"
      formData={formData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <BasicInfoStep
      key="basic-info"
      formData={formData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <LinksStep
      key="links"
      formData={formData}
      onNext={handleNext}
      onBack={handleBack}
      onFinish={true}
    />,
  ];

  useEffect(() => {
    if (session) {
      checkHaveCard(session?.user?.id);
    }
  }, [session]);

  return (
    <div className="w-full max-w-lg mx-auto py-8 flex flex-col gap-6">

      {/* ── Progress dots ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-1.5"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={[
                  "w-4 h-4 rounded-full transition-colors duration-300",
                  index < currentStep ? "bg-primary cursor-pointer" : "",
                  index === currentStep
                    ? "bg-primary ring-4 ring-primary/20"
                    : "",
                  index > currentStep ? "bg-muted" : "",
                ].join(" ")}
                onClick={() => {
                  if (index < currentStep) setCurrentStep(index);
                }}
                whileTap={{ scale: 0.95 }}
              />
              <span
                className={[
                  "text-xs hidden sm:block",
                  index === currentStep
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {/* pull title from the step's key */}
                {["Slug", "Basic Info", "Links"][index]}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* ── Active step ── */}
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

      {/* ── Step label ── */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Step {currentStep + 1} of {steps.length}
      </motion.p>
    </div>
  );
}
