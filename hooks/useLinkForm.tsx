"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    getPlatform,
    defaultLinkItem,
    linksFormSchema,
    LinksFormValues,
    isTitleDefault,
} from "@/lib/social-platforms";
import { LinkItem } from "@/types/onboarding";

type UseLinkFormOptions = {
    defaultLinks?: LinkItem[];
    values?: LinkItem[];
    onSubmit: (links: LinksFormValues["links"]) => void;
};

export function useLinkForm({ defaultLinks = [], values, onSubmit }: UseLinkFormOptions) {
    const form = useForm<LinksFormValues>({
        resolver: zodResolver(linksFormSchema),
        defaultValues: {
            links: defaultLinks.length > 0 ? defaultLinks : [defaultLinkItem()],
        },
        values: values ? { links: values } : undefined,
        mode: "all",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "links",
    });

    const watchedLinks = form.watch("links");

    const handlePlatformChange = (index: number, key: string) => {
        const platform = getPlatform(key);
        const currentTitle = watchedLinks[index].title;
        form.setValue(`links.${index}.platform`, key, { shouldValidate: true });
        form.setValue(`links.${index}.url`, "", { shouldValidate: true });
        if (isTitleDefault(currentTitle)) {
            form.setValue(`links.${index}.title`, platform.label, { shouldValidate: true });
        }
    };

    const handleAddLink = () => {
        append(defaultLinkItem());
        setTimeout(() => form.trigger(`links.${fields.length}`), 50);
    };

    const handleSubmit = form.handleSubmit((values) => onSubmit(values.links));

    return {
        form,
        fields,
        remove,
        watchedLinks,
        isValid: form.formState.isValid,
        errors: form.formState.errors,
        handlePlatformChange,
        handleAddLink,
        handleSubmit,
    };
}