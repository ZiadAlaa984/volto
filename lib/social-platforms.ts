import { z } from "zod";

// ── Types ────────────────────────────────────────────────────────────────────

export type SocialPlatform = {
  key: string;
  label: string;
  icon: string;
  placeholder: string;
};

export type SocialPlatformGroup = {
  group: string;
  platforms: SocialPlatform[];
};

// ── Grouped Platforms ────────────────────────────────────────────────────────

export const SOCIAL_PLATFORMS_GROUPED: SocialPlatformGroup[] = [
  {
    group: "Social Media",
    platforms: [
      { key: "twitter", label: "Twitter / X", icon: "Twitter", placeholder: "https://x.com/username" },
      { key: "instagram", label: "Instagram", icon: "Instagram", placeholder: "https://instagram.com/username" },
      { key: "facebook", label: "Facebook", icon: "Facebook", placeholder: "https://facebook.com/username" },
      { key: "threads", label: "Threads", icon: "AtSign", placeholder: "https://threads.net/@username" },
      { key: "snapchat", label: "Snapchat", icon: "Ghost", placeholder: "https://snapchat.com/add/username" },
      { key: "pinterest", label: "Pinterest", icon: "Pin", placeholder: "https://pinterest.com/username" },
      { key: "reddit", label: "Reddit", icon: "MessageCircle", placeholder: "https://reddit.com/u/username" },
      { key: "bluesky", label: "Bluesky", icon: "Cloud", placeholder: "https://bsky.app/profile/username" },
      { key: "mastodon", label: "Mastodon", icon: "Rss", placeholder: "https://mastodon.social/@username" },
      { key: "tumblr", label: "Tumblr", icon: "BookMarked", placeholder: "https://username.tumblr.com" },
    ],
  },
  {
    group: "Professional",
    platforms: [
      { key: "linkedin", label: "LinkedIn", icon: "Linkedin", placeholder: "https://linkedin.com/in/username" },
      { key: "github", label: "GitHub", icon: "Github", placeholder: "https://github.com/username" },
      { key: "gitlab", label: "GitLab", icon: "GitBranch", placeholder: "https://gitlab.com/username" },
      { key: "dribbble", label: "Dribbble", icon: "Dribbble", placeholder: "https://dribbble.com/username" },
      { key: "behance", label: "Behance", icon: "Layers", placeholder: "https://behance.net/username" },
      { key: "devto", label: "Dev.to", icon: "Code2", placeholder: "https://dev.to/username" },
      { key: "hashnode", label: "Hashnode", icon: "Hash", placeholder: "https://hashnode.com/@username" },
      { key: "medium", label: "Medium", icon: "BookOpen", placeholder: "https://medium.com/@username" },
      { key: "substack", label: "Substack", icon: "Mail", placeholder: "https://username.substack.com" },
      { key: "producthunt", label: "Product Hunt", icon: "Rocket", placeholder: "https://producthunt.com/@username" },
    ],
  },
  {
    group: "Video & Streaming",
    platforms: [
      { key: "youtube", label: "YouTube", icon: "Youtube", placeholder: "https://youtube.com/@username" },
      { key: "tiktok", label: "TikTok", icon: "Music2", placeholder: "https://tiktok.com/@username" },
      { key: "twitch", label: "Twitch", icon: "Tv2", placeholder: "https://twitch.tv/username" },
      { key: "vimeo", label: "Vimeo", icon: "Video", placeholder: "https://vimeo.com/username" },
      { key: "kick", label: "Kick", icon: "Zap", placeholder: "https://kick.com/username" },
    ],
  },
  {
    group: "Music",
    platforms: [
      { key: "spotify", label: "Spotify", icon: "Music", placeholder: "https://open.spotify.com/user/username" },
      { key: "soundcloud", label: "SoundCloud", icon: "Mic2", placeholder: "https://soundcloud.com/username" },
      { key: "applemusic", label: "Apple Music", icon: "Music4", placeholder: "https://music.apple.com/profile/username" },
      { key: "bandcamp", label: "Bandcamp", icon: "Disc3", placeholder: "https://username.bandcamp.com" },
    ],
  },
  {
    group: "Messaging",
    platforms: [
      { key: "whatsapp", label: "WhatsApp", icon: "MessageCircle", placeholder: "https://wa.me/1234567890 or +1234567890" },
      { key: "telegram", label: "Telegram", icon: "Send", placeholder: "https://t.me/username" },
      { key: "discord", label: "Discord", icon: "Headphones", placeholder: "https://discord.gg/invitecode" },
      { key: "signal", label: "Signal", icon: "ShieldCheck", placeholder: "https://signal.me/#p/username" },
    ],
  },
  {
    group: "Commerce & Support",
    platforms: [
      { key: "patreon", label: "Patreon", icon: "Heart", placeholder: "https://patreon.com/username" },
      { key: "buymeacoffee", label: "Buy Me a Coffee", icon: "Coffee", placeholder: "https://buymeacoffee.com/username" },
      { key: "kofi", label: "Ko-fi", icon: "Gift", placeholder: "https://ko-fi.com/username" },
      { key: "gumroad", label: "Gumroad", icon: "ShoppingBag", placeholder: "https://username.gumroad.com" },
      { key: "etsy", label: "Etsy", icon: "Store", placeholder: "https://etsy.com/shop/username" },
    ],
  },
  {
    group: "Other",
    platforms: [
      // In SOCIAL_PLATFORMS_GROUPED, "Other" group:
      { key: "email", label: "Email", icon: "Mail", placeholder: "you@example.com or mailto:you@example.com" },
      { key: "phone", label: "Phone", icon: "Phone", placeholder: "+1234567890 or tel:+1234567890" },
      // In "Messaging" group:
      { key: "other", label: "Other", icon: "Link", placeholder: "https://..." },
    ],
  },
];

// ── Flat list for lookups ─────────────────────────────────────────────────────

export const SOCIAL_PLATFORMS: SocialPlatform[] = SOCIAL_PLATFORMS_GROUPED.flatMap(g => g.platforms);

export type PlatformKey = string;

export const getPlatform = (key: string): SocialPlatform =>
  SOCIAL_PLATFORMS.find((p) => p.key === key) ?? SOCIAL_PLATFORMS.at(-1)!;

// ── Social Keys (all general social/content platforms) ────────────────────────

export const SOCIAL_KEYS: string[] = [
  // Social Media
  "twitter", "instagram", "facebook", "threads",
  "snapchat", "pinterest", "reddit", "bluesky", "mastodon", "tumblr",
  // Video & Streaming
  "youtube", "tiktok", "twitch", "vimeo", "kick",
  // Music
  "spotify", "soundcloud", "applemusic", "bandcamp",
];

// ── Schema ────────────────────────────────────────────────────────────────────

// ── Helpers for URL validation ────────────────────────────────────────────────

const EMAIL_KEYS = ["email"];
const PHONE_KEYS = ["phone", "whatsapp"];

export const linkItemSchema = z.object({
  id: z.string().optional(),
  card_id: z.string().optional(),
  order_num: z.number().optional(),
  platform: z.string().min(1),
  title: z.string().max(48, "Title must be at most 48 characters"),
  url: z.string().min(1, "Required"),
}).superRefine((data, ctx) => {
  const { platform, url } = data;

  if (EMAIL_KEYS.includes(platform)) {
    // Accept "mailto:you@example.com" or plain "you@example.com"
    const email = url.startsWith("mailto:") ? url.slice(7) : url;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["url"],
        message: "Must be a valid email address",
      });
    }
  } else if (PHONE_KEYS.includes(platform)) {
    // Accept "tel:+123..." / "https://wa.me/..." or plain digits/+
    const isTel = /^tel:\+?[\d\s\-().]+$/.test(url);
    const isWaMe = /^https:\/\/wa\.me\/\d+/.test(url);
    const isPlain = /^\+?[\d\s\-().]{7,}$/.test(url);
    if (!isTel && !isWaMe && !isPlain) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["url"],
        message: "Must be a valid phone number or wa.me link",
      });
    }
  } else {
    // All other platforms: must be a valid https URL
    const result = z.string().url("Must be a valid URL (include https://)").safeParse(url);
    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["url"],
        message: "Must be a valid URL (include https://)",
      });
    }
  }
});
export const linksFormSchema = z.object({
  links: z.array(linkItemSchema).min(1, "Add at least one link"),
});

export type LinkItemFormValues = z.infer<typeof linkItemSchema>;
export type LinksFormValues = z.infer<typeof linksFormSchema>;

export const defaultLinkItem = (): LinkItemFormValues => ({
  id: undefined,
  card_id: undefined,
  order_num: undefined,
  platform: "other",
  title: "",
  url: "",
});

// ── Helpers ───────────────────────────────────────────────────────────────────

export const isTitleDefault = (title: string) =>
  title === "" || SOCIAL_PLATFORMS.some((p) => p.label === title);

export const resolveTitle = (title: string, platformKey: string) =>
  title.trim() || getPlatform(platformKey).label;