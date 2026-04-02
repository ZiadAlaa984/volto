import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  isValid?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
};

function CardFooterSteps({
  onBack,
  onNext,
  isValid = true,
  isFirstStep = false,
  isLastStep = false,
}: Props) {
  return (
    <CardFooter className="flex justify-between pt-2 pb-4">
      
      {/* Back Button */}
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

      {/* Next / Finish Button */}
      <Button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className="rounded-2xl gap-1"
      >
        {isLastStep ? "Finish" : "Next"}
        {isLastStep ? (
          <Check className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

    </CardFooter>
  );
}

export default CardFooterSteps;