import { cookies } from 'next/headers';
import { CategoryService } from '@/app/admin/categories.service';
import CategoryToolbar from './components/CategoryToolbar';
import CategoryStats from './components/CategoryStats';
import CategoryFilters from './components/CategoryFilters';
import CategoryCard from './components/CategoryCard';

export const dynamic = 'force-dynamic';



interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function AdminCategoryManagement({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const searchQuery = resolvedParams.search || '';
  const statusFilter = resolvedParams.status || 'all';

  // Fetch data
  let categories = await CategoryService.getAll(cookieString);

  // Server-side filtering (Service can be updated later to support params)
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="relative w-full min-h-screen py-24 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      {/* Gradient Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header and Create Button */}
        <CategoryToolbar />

        {/* Stats Overview */}
        <CategoryStats categories={categories} />

        {/* Filters */}
        <CategoryFilters />

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <CategoryCard 
                key={index} 
                category={category} 
                index={index} 
              />
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <svg
                className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No categories found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or create a new category
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}