import MainContent from "@/components/pages/Card/MainContent"
import { getBusinessInfo } from "@/services/queries/getBusinessInfo"
import { getCardByUsername } from "@/services/queries/getCardByUsername"
import { BusinessType } from "@/types/business"

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = await params
  const cardData = await getCardByUsername(username)

  let businessData: BusinessType | null = null
  if (cardData?.card_type === 'business') {
    businessData = await getBusinessInfo(cardData.id as string)
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <MainContent CardData={cardData} businessData={businessData || null} />
    </div>
  )
}