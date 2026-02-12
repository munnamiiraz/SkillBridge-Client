import { TutorReviewsClient } from './components/TutorReviewsClient';
import { getTutorReviews, getTutorBasicInfo } from '@/app/services/tutor-reviews-public.service';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TutorReviewsPage({ params }: PageProps) {
  const { id } = await params;

  const [tutorResult, reviewsResult] = await Promise.all([
    getTutorBasicInfo(id),
    getTutorReviews(id, 1, 10)
  ]);

  if (tutorResult.error || !tutorResult.data) {
    notFound();
  }

  const tutorName = tutorResult.data.user.name;
  const reviews = reviewsResult.data || [];
  const meta = reviewsResult.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  return <TutorReviewsClient tutorId={id} tutorName={tutorName} initialReviews={reviews} initialMeta={meta} />;
}
