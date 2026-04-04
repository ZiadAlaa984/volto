import { z } from "zod";

export const SOCIAL_PLATFORMS = [
  {
    key: "twitter",
    label: "Twitter / X",
    icon: "Twitter",
    placeholder: "https://twitter.com/username",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "Instagram",
    placeholder: "https://instagram.com/username",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: "Facebook",
    placeholder: "https://facebook.com/username",
  },
  {
    key: "linkedin",
    label: "Linkedin",
    icon: "Linkedin",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "github",
    label: "Github",
    icon: "Github",
    placeholder: "https://github.com/username",
  },
  {
    key: "youtube",
    label: "Youtube",
    icon: "Youtube",
    placeholder: "https://youtube.com/@username",
  },
  {
    key: "tiktok",
    label: "Tiktok",
    icon: "Music2",
    placeholder: "https://tiktok.com/@username",
  },
  {
    key: "website",
    label: "Website",
    icon: "Globe",
    placeholder: "https://yourwebsite.com",
  },
  { key: "other", label: "Other", icon: "Link", placeholder: "https://..." },
] as const;

export type PlatformKey = (typeof SOCIAL_PLATFORMS)[number]["key"];

export const getPlatform = (key: string) =>
  SOCIAL_PLATFORMS.find((p) => p.key === key) ?? SOCIAL_PLATFORMS.at(-1)!;

export const defaultLinkItem = (): LinkItemFormValues => ({
  platform: "other",
  title: "",
  url: "",
});

// ── Schema ───────────────────────────────────────────────────────────────────

export const linkItemSchema = z.object({
  platform: z.string().min(1),
  title: z.string().max(48, "Title must be at most 48 characters"),
  url: z
    .string()
    .min(1, "URL is required")
    .url("Must be a valid URL (include https://)"),
});

// in linksFormSchema — already has .min(1) but add a clearer message
export const linksFormSchema = z.object({
  links: z.array(linkItemSchema).min(1, "Add at least one link"),
});

export type LinkItemFormValues = z.infer<typeof linkItemSchema>;
export type LinksFormValues = z.infer<typeof linksFormSchema>;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if the title is empty or still matches any platform default label */
export const isTitleDefault = (title: string) =>
  title === "" || SOCIAL_PLATFORMS.some((p) => p.label === title);

/** Resolves display title: custom title → platform label fallback */
export const resolveTitle = (title: string, platformKey: string) =>
  title.trim() || getPlatform(platformKey).label;
