import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Check, Loader } from "lucide-react";

type Props = {
  onBack?: () => void;
  onNext?: (value: any) => void;
  isValid?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
};

function CardFooterSteps({
  onBack,
  onNext,
  isValid = true,
  isFirstStep = false,
  isLastStep = false,
  isLoading = false
}: Props) {
  return (
    <CardFooter className={`${isFirstStep ? 'justify-end' : 'justify-between'} flex   pt-2 pb-4`}>

      {/* Back Button */}
      {isFirstStep ? null : (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isFirstStep}
          className="rounded-2xl gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {/* Next / Finish Button */}
      <Button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className="rounded-2xl gap-1"
      >
        {isLoading ? <Loader className="animate-spin" /> : isLastStep ? <>
          Finish
          <Check className="h-4 w-4" />
        </> : <> Next <ChevronRight className="h-4 w-4" /></>}
      </Button>

    </CardFooter>
  );
}

export default CardFooterSteps;