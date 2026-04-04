"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StepProps } from "@/types/onboarding";
import CardFooterSteps from "../CardFooterSteps";
import { fadeInUp } from "../OnboardingForm";

const BasicInfoSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(48, "Name must be at most 48 characters"),
  bio: z.string().max(60, "Bio must be at most 60 characters").optional(),
});

type BasicInfoFormValues = z.infer<typeof BasicInfoSchema>;

export function BasicInfoStep({ formData, onNext, onBack }: StepProps) {
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      name: formData.name ?? "",
      bio: formData.bio ?? "",
    },
    mode: "onChange",
  });

  const name = form.watch("name") ?? "";
  const bio = form.watch("bio") ?? "";
  const isValid = form.formState.isValid;

  const handleNext = form.handleSubmit((values) => {
    onNext({ name: values.name, bio: values.bio });
  });

  return (
    <Card className="rounded-3xl shadow-md border w-full">
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
        <CardDescription>Tell the world who you are.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={handleNext} className="space-y-4">
            <motion.div {...fadeInUp(0)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div {...fadeInUp(0.08)} className="space-y-2">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short intro about yourself…"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Live preview */}
            <motion.div
              {...fadeInUp(0.16)}
              className="rounded-xl bg-muted/50 border border-dashed px-4 py-3 space-y-1"
            >
              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                Preview
              </p>
              <motion.p
                key={`n-${name}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-muted-foreground italic"
              >
                {name.trim() === "" ? (
                  "You haven't set a display name yet."
                ) : (
                  <>
                    Your name is{" "}
                    <span className="font-semibold text-foreground not-italic">
                      {name}
                    </span>
                    .
                  </>
                )}
              </motion.p>
              <motion.p
                key={`b-${bio}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="text-sm text-muted-foreground italic"
              >
                {bio.trim() === "" ? (
                  "No bio written yet."
                ) : (
                  <>
                    Bio:{" "}
                    <span className="text-foreground not-italic">"{bio}"</span>
                  </>
                )}
              </motion.p>
            </motion.div>
          </form>
        </Form>
      </CardContent>

      <CardFooterSteps onBack={onBack} onNext={handleNext} isValid={isValid} />
    </Card>
  );
}