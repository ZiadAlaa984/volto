
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Setting up your profile..." },
  { text: "Saving your links..." },
  { text: "Almost there..." },
  { text: "You're all set!" },
];


type Props = {
  loading: boolean;
  step: number;
};

export default function MultiStepLoaderDemo({ loading, step }: Props) {
  return (
    <MultiStepLoader
      loadingStates={loadingStates}
      loading={loading}
      currentStep={step}
      loop={false}
    />
  );
}