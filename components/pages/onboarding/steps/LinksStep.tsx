"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CardType, StepProps } from "@/types/onboarding";
import CardFooterSteps from "../CardFooterSteps";
import { fadeInUp } from "../OnboardingForm";
import {
  SOCIAL_PLATFORMS,
  getPlatform,
  defaultLinkItem,
  linksFormSchema,
  LinksFormValues,
  isTitleDefault,
  resolveTitle,
} from "@/lib/social-platforms";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { catchAsync } from "@/lib/utils";
import { useCard } from "@/hooks/useCard";
import MultiStepLoaderDemo from "@/components/multi-step-loader-demo";

export function LinksStep({ formData, onNext, onBack, onFinish }: StepProps) {
  const { createAsync, isLoading, step } = useCard();
  const form = useForm<LinksFormValues>({
    resolver: zodResolver(linksFormSchema),
    defaultValues: {
      links: formData.links?.length > 0 ? formData.links : [defaultLinkItem()],
    },
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const watchedLinks = form.watch("links");
  const isValid = form.formState.isValid;

  const handlePlatformChange = (index: number, key: string) => {
    const platform = getPlatform(key);
    const currentTitle = watchedLinks[index].title;
    form.setValue(`links.${index}.platform`, key, { shouldValidate: true });
    form.setValue(`links.${index}.url`, "", { shouldValidate: true });
    if (isTitleDefault(currentTitle)) {
      form.setValue(`links.${index}.title`, platform.label, {
        shouldValidate: true,
      });
    }
  };

  const handleFinish = catchAsync(async (finalValues: CardType) => {
    await createAsync(finalValues);
  });

  const handleAddLink = () => {
    append(defaultLinkItem());
    setTimeout(() => form.trigger(`links.${fields.length}`), 50);
  };

  const handleNext = form.handleSubmit((values) => {
    const finalData: CardType = { ...formData, links: values.links };
    if (onFinish) {
      handleFinish(finalData);
    } else {
      onNext({ links: values.links });
    }
  });
  return (
    <Card className="rounded-3xl shadow-md border w-full">
      {isLoading && <MultiStepLoaderDemo step={step} loading={isLoading} />}
      <CardHeader>
        <CardTitle>Your Links</CardTitle>
        <CardDescription>
          Add the links you want to share on your profile.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={handleNext} className="space-y-4">
            <motion.div {...fadeInUp(0)} className="space-y-3">
              <AnimatePresence initial={false}>
                {fields.map((field, index) => {
                  const platform = getPlatform(
                    watchedLinks[index]?.platform ?? "other",
                  );
                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.05 },
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        transition: { duration: 0.18 },
                      }}
                      className="rounded-xl border p-3 space-y-2"
                    >
                      {/* ── Platform select ── */}
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`links.${index}.platform`}
                          render={({ field: f }) => (
                            <FormItem className="flex-1">
                              <Select
                                value={f.value}
                                onValueChange={(val) => {
                                  f.onChange(val);
                                  handlePlatformChange(index, val);
                                }}
                              >
                                <FormControl>
                                  {/* ✅ SelectValue hidden (required by shadcn internally)
                                      icon+label rendered as overlay inside trigger */}
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select platform" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SOCIAL_PLATFORMS.map((p) => (
                                    <SelectItem key={p.key} value={p.key}>
                                      <span className="flex items-center gap-2">
                                        <PlatformIcon
                                          name={p.icon}
                                          className="h-4 w-4 shrink-0"
                                        />
                                        {p.label}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* ── Custom title ── */}
                      <FormField
                        control={form.control}
                        name={`links.${index}.title`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={`Label (default: ${platform.label})`}
                                {...f}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* ── URL ── */}
                      <FormField
                        control={form.control}
                        name={`links.${index}.url`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={platform.placeholder}
                                {...f}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 rounded-xl border-dashed"
                onClick={handleAddLink}
              >
                <Plus className="h-4 w-4" /> Add another link
              </Button>

              {/* array-level error */}
              {form.formState.errors.links?.message && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.links.message}
                </p>
              )}
            </motion.div>

            {/* ── Live preview ── */}
            <motion.div
              {...fadeInUp(0.08)}
              className="rounded-xl bg-muted/50 border border-dashed px-4 py-3"
            >
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Preview
              </p>
              <AnimatePresence initial={false}>
                {watchedLinks.filter((l) => l.url.trim()).length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-muted-foreground italic"
                  >
                    No links added yet.
                  </motion.p>
                ) : (
                  watchedLinks
                    .filter((l) => l.url.trim())
                    .map((link, i) => {
                      const p = getPlatform(link.platform);
                      return (
                        <motion.div
                          key={`${link.platform}-${i}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: i * 0.06 },
                          }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-sm py-0.5"
                        >
                          <PlatformIcon
                            name={p.icon}
                            className="h-4 w-4 shrink-0 text-foreground"
                          />
                          <span className="font-semibold text-foreground">
                            {resolveTitle(link.title, link.platform)}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground underline underline-offset-2 truncate">
                            {link.url}
                          </span>
                        </motion.div>
                      );
                    })
                )}
              </AnimatePresence>
            </motion.div>
          </form>
        </Form>
      </CardContent>

      <CardFooterSteps
        onBack={onBack}
        onNext={handleNext}
        isLoading={isLoading}
        isValid={isValid}
        isLastStep
      />
    </Card>
  );
}
