import MainContent from "@/components/pages/Card/MainContent";
import { getBusinessInfo } from "@/services/queries/getBusinessInfo";
import { getCardByUsername } from "@/services/queries/getCardByUsername";
import { getReviews, ReviewsResult } from "@/services/queries/getReviews";
import { BusinessType } from "@/types/business";

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = await params;

  const cardData = await getCardByUsername(username);

  let businessData: BusinessType | null = null;
  let reviews: ReviewsResult = {
    reviews: [],
    totalStars: 0,
    count: 0,
    averageRating: 0,
  };

  if (cardData?.card_type === "business") {
    // 1️⃣ get business data first
    businessData = await getBusinessInfo(cardData.id as string);

    // 2️⃣ then conditionally fetch reviews
    if (businessData?.active_reviews) {
      reviews = await getReviews(cardData.id as string);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <MainContent
        CardData={cardData}
        businessData={businessData}
        reviews={businessData?.active_reviews ? reviews : null}
      />
    </div>
  );
}