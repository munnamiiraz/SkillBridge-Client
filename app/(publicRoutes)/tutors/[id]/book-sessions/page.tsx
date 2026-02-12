import { BookSessionClient } from './components/BookSessionClient';
import { getTutorForBooking } from '@/app/services/book-session.service';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookSessionPage({ params }: PageProps) {
  const { id } = await params;

  const { data, error } = await getTutorForBooking(id);

  if (error || !data) {
    notFound();
  }

  return <BookSessionClient tutorId={id} initialTutorData={data} />;
}
