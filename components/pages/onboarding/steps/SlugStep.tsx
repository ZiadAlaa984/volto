"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { StepProps } from "@/types/onboarding";
import CardFooterSteps from "../CardFooterSteps";
import { catchAsync, toastShared, sanitizeSlug } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { fadeInUp } from "@/lib/Animation/stepVariants";
import { UserNameFormValues, userNameSchema } from "@/lib/Schema/userNameSchema";

// ─── Component ────────────────────────────────────────────────────────────────

export function SlugStep({ formData, onNext, onBack }: StepProps) {
  const { checkUsername, isPending } = useProfile();
  // ✅ in SlugStep.tsx

  const form = useForm<UserNameFormValues>({
    resolver: zodResolver(userNameSchema),
    defaultValues: { user_name: formData.user_name ?? "" },
    mode: "onChange",
  });

  const slug = form.watch("user_name");
  const isValid = form.formState.isValid;

  const handleNext = form.handleSubmit(
    catchAsync(async ({ user_name }) => {
      const exists = await checkUsername(user_name);

      if (exists) {
        toastShared({
          title: "Username unavailable",
          description: "That username is already taken. Please choose a different one.",
          variant: "warning",
        });
        return;
      }

      toastShared({
        title: "Great choice! 🎉",
        description: "This username is available — go ahead and claim it!",
      });

      onNext({ user_name });
    }),
  );

  return (
    <Card className="rounded-3xl shadow-md border w-full">
      <CardHeader>
        <CardTitle>Choose your username</CardTitle>
        <CardDescription>
          Pick a unique slug for your public profile URL.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={handleNext} className="space-y-4">

            {/* Username input */}
            <motion.div {...fadeInUp(0)} className="space-y-2">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <div className="flex items-center md:flex-nowrap flex-wrap gap-2">
                      <FormControl>
                        <Input
                          placeholder="ziad-alaa"
                          {...field}
                          onChange={(e) => field.onChange(sanitizeSlug(e.target.value))}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* URL preview */}
            <motion.div
              {...fadeInUp(0.08)}
              className="rounded-xl bg-muted/50 border border-dashed px-4 py-3"
            >
              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                Preview
              </p>
              <motion.p
                key={slug}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-muted-foreground italic"
              >
                {slug?.trim() ? (
                  <>
                    Your profile will be at{" "}
                    <span className="font-semibold text-foreground not-italic">
                      /{slug}
                    </span>
                  </>
                ) : (
                  "Your public profile URL hasn't been set yet."
                )}
              </motion.p>
            </motion.div>

          </form>
        </Form>
      </CardContent>

      <CardFooterSteps
        isFirstStep
        onNext={handleNext}
        onBack={onBack}
        isValid={isValid && !isPending}
        isLoading={isPending}
      />
    </Card>
  );
}