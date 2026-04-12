"use client"
import React from 'react';

/**
 * AdminRouteGroupLayout
 * This layout serves as a transparent wrapper for the (adminRoutes) group.
 * The actual administrative UI shell (sidebar, header, content wrapper) 
 * is handled by the nested /admin/layout.tsx to allow for 
 * more specific route targeting and high-fidelity design.
 */
export default function AdminRouteGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-route-wrapper contents">
      {children}
    </div>
  );
}
