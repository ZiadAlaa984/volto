const CARD_CREATION_STEPS = {
    IDLE: 0,
    SETTING_PROFILE: 1,
    UPLOADING_PROFILE_PICTURE: 2,
    CREATING_CARD: 3,    // ← to match execution order
    CREATING_LINKS: 4,   // ← swap these two
    DONE: 5,
} as const;
export default CARD_CREATION_STEPS;


export const loadingStates = [
    { step: CARD_CREATION_STEPS.IDLE, text: "Starting..." },
    { step: CARD_CREATION_STEPS.SETTING_PROFILE, text: "Setting up your profile..." },
    { step: CARD_CREATION_STEPS.UPLOADING_PROFILE_PICTURE, text: "Saving your profile picture..." },
    { step: CARD_CREATION_STEPS.CREATING_CARD, text: "Creating your card..." },   // index 3 ✅
    { step: CARD_CREATION_STEPS.CREATING_LINKS, text: "Saving your links..." },   // index 4 ✅
    { step: CARD_CREATION_STEPS.DONE, text: "You're all set!" },
];