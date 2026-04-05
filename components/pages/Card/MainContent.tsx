import { CardType } from "@/types/onboarding"

function MainContent({ CardData }: { CardData: CardType }) {


    return (
        <div>MainContent {CardData?.name}</div>
    )
}

export default MainContent