const CARD_CREATION_STEPS = {
    IDLE: 0,
    SETTING_PROFILE: 1,
    UPLOADING_PROFILE_PICTURE: 2,
    CREATING_LINKS: 3,
    CREATING_CARD: 4,
    DONE: 5,
} as const;

export default CARD_CREATION_STEPS;


export const loadingStates = [
    { step: CARD_CREATION_STEPS.SETTING_PROFILE, text: "Setting up your profile..." },
    { step: CARD_CREATION_STEPS.UPLOADING_PROFILE_PICTURE, text: "Saving your profile picture..." },
    { step: CARD_CREATION_STEPS.CREATING_CARD, text: "Almost there..." },
    { step: CARD_CREATION_STEPS.CREATING_LINKS, text: "Saving your links..." },
    { step: CARD_CREATION_STEPS.DONE, text: "You're all set!" },
];