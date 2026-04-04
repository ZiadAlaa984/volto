import MultiStepLoaderDemo from "@/components/multi-step-loader-demo";
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from "@/components/ui/card";
import { useCard } from "@/hooks/useCard";
import { useLinkForm } from "@/hooks/useLinkForm";
import { CardType, StepProps } from "@/types/onboarding";
import { LinksForm } from "./LinksForm";
import CardFooterSteps from "../../CardFooterSteps";

export function LinksStep({ formData, onNext, onBack, onFinish }: StepProps) {
  const { createCard, isLoading, step } = useCard();

  const {
    form,
    fields,
    remove,
    watchedLinks,
    isValid,
    errors,
    handlePlatformChange,
    handleAddLink,
    handleSubmit
  } = useLinkForm({
    defaultLinks: formData.links,
    onSubmit: (links) => {
      const finalData: CardType = { ...formData, links };
      onFinish ? createCard(finalData) : onNext({ links });
    },
  });

  return (
    <Card className="rounded-3xl shadow-md border w-full">
      {isLoading && <MultiStepLoaderDemo step={step} loading={isLoading} />}
      <CardHeader>
        <CardTitle>Your Links</CardTitle>
        <CardDescription>Add the links you want to share on your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <LinksForm
          form={form}
          fields={fields}
          watchedLinks={watchedLinks}
          errors={errors}
          onPlatformChange={handlePlatformChange}
          onAddLink={handleAddLink}
          onRemove={remove}
          onSubmit={handleSubmit}
        />
      </CardContent>
      <CardFooterSteps onBack={onBack} onNext={handleSubmit} isLoading={isLoading} isValid={isValid} isLastStep />
    </Card>
  );
}