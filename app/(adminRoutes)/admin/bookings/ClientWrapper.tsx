'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AdminBookingsContent = dynamic(() => import('./AdminBookingsContent'), {
  ssr: false,
  loading: () => (
    <div className="p-6 lg:p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-6"></div>
        <div className="h-20 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
        </div>
      </div>
    </div>
  )
});

export default function ClientWrapper() {
  return (
    <React.Suspense fallback={
       <div className="p-6 lg:p-8">
       <div className="animate-pulse">
         <div className="h-8 bg-gray-200 rounded mb-4"></div>
         <div className="h-32 bg-gray-200 rounded mb-6"></div>
         <div className="h-20 bg-gray-200 rounded mb-6"></div>
         <div className="space-y-4">
           {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
         </div>
       </div>
     </div>
    }>
      <AdminBookingsContent />
    </React.Suspense>
  );
}