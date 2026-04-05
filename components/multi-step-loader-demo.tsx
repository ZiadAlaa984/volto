
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { loadingStates } from "@/lib/utils/steps";




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