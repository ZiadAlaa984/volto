


import MainContent from "@/components/pages/Card/MainContent";
import { getCardByUsername } from "@/services/queries/getCardByUsername";

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = await params;
  const cardData = await getCardByUsername(username);

  return (
    <div className="flex min-h-screen flex-col justify-center items-center">
      <MainContent CardData={cardData} />
    </div>
  );
}