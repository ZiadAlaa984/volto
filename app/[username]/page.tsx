import MainContent from "@/components/pages/Card/MainContent";
import { getBusinessInfo } from "@/services/queries/getBusinessInfo";
import { getCardByUsername } from "@/services/queries/getCardByUsername";
import { getReviews } from "@/services/queries/getReviews";
import { BusinessType } from "@/types/business";

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = await params
  const cardData = await getCardByUsername(username)

  let businessData: BusinessType | null = null;
  let reviews = [];

  if (cardData?.card_type === 'business') {
    // fetch in parallel ← faster
    [businessData, reviews] = await Promise.all([
      getBusinessInfo(cardData.id as string),
      getReviews(cardData.id as string),       // ← add this
    ]);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <MainContent
        CardData={cardData}
        businessData={businessData || null}
        reviews={reviews}    // ← pass down
      />
    </div>
  )
}