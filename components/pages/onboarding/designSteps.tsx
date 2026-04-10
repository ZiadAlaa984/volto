

import { motion } from "framer-motion";

import { STEPS } from "./Constants";

interface StepDotsProps {
    currentStep: number;
    onNavigate: (index: number) => void;
}

export function StepDots({ currentStep, onNavigate }: StepDotsProps) {
    return (
        <div className="flex justify-between">
            {STEPS.map(({ key, label }, index) => {
                const isPast = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                    <motion.div
                        key={key}
                        className="flex flex-col items-center gap-1.5"
                        whileHover={{ scale: 1.1 }}
                    >
                        <motion.div
                            onClick={() => isPast && onNavigate(index)}
                            whileTap={{ scale: 0.95 }}
                            className={[
                                "w-4 h-4 rounded-full transition-colors duration-300",
                                isPast ? "bg-primary cursor-pointer" : "",
                                isCurrent ? "bg-primary ring-4 ring-primary/20" : "",
                                !isPast && !isCurrent ? "bg-muted" : "",
                            ].join(" ")}
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
    );
}

interface ProgressBarProps {
    progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
}