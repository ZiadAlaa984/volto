import { SlugStep } from "./steps/SlugStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { LinksStep } from "./steps/Links/LinksStep";
import { ProfilePictureStep } from "./steps/ProfilePictureStep";
import { CardType } from "@/types/onboarding";

// ─── Constants ───────────────────────────────────────────────────────────────

export const STEPS = [
    { key: "slug", label: "Slug", Component: SlugStep },
    { key: "basic-info", label: "Basic Info", Component: BasicInfoStep },
    { key: "profile-picture", label: "Profile Picture", Component: ProfilePictureStep },
    { key: "links", label: "Links", Component: LinksStep },
] as const;

export const INITIAL_FORM_DATA: CardType = {
    card_type: "personal",
    user_name: "",
    profile_picture: null,
    name: "",
    bio: "",
    links: [{ title: "", url: "", platform: "" }],
};
