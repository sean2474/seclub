import { ReservationDetailContent } from "./_components/reservation-detail-content";

interface ReservationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const { id } = await params;
  return <ReservationDetailContent id={id} />;
}
