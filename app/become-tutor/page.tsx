import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCategories } from '@/app/services/become-tutor.service';
import { BecomeTutorClient } from './components/BecomeTutorClient';

export const dynamic = 'force-dynamic';

const BecomeTutorPage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const { data: categories, error } = await getCategories();

  if (error) {
    redirect('/');
  }

  return <BecomeTutorClient categories={categories || []} />;
};

export default BecomeTutorPage;
