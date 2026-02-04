import { cookies } from 'next/headers';
import { UserService } from '@/app/admin/users.service';
import UserStats from './components/UserStats';
import UserTabs from './components/UserTabs';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import UserPagination from './components/UserPagination';
import { userService } from '@/lib/get-sessions';

export const dynamic = 'force-dynamic';


interface PageProps {
  searchParams: Promise<{
    page?: string;
    role?: string;
    status?: string;
    search?: string;
  }>;
}

export default async function AdminUserManagementPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const currentPage = parseInt(resolvedParams.page || '1');
  const roleFilter = resolvedParams.role || 'all';
  const statusFilter = resolvedParams.status || 'all';
  const searchQuery = resolvedParams.search || '';

  // Fetch data
  const { data } = await userService.getSession();
  const { users, pagination } = await UserService.getAll({
    page: currentPage,
    limit: 10,
    role: roleFilter !== 'all' ? roleFilter.toUpperCase() : undefined,
    status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
    search: searchQuery,
  }, cookieString);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                User Management
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all students and tutors in one place
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <UserStats total={pagination.total} users={users} />

      {/* Tabs */}
      <UserTabs total={pagination.total} />

      {/* Search and Filters */}
      <UserFilters />

      {/* Users Table */}
      <UserTable users={users} />

      {/* Pagination */}
      <UserPagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={users.length}
      />
    </div>
  );
}