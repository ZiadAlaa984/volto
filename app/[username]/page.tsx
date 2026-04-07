


import MainContent from "@/components/pages/Card/MainContent";
import { getCardByUsername } from "@/services/queries/getCardByUsername";

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = await params;
  const cardData = await getCardByUsername(username);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <MainContent CardData={cardData} />
    </div>
  );
}