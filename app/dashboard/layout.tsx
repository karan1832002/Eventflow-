/**
 * app/dashboard/layout.tsx
 * 
 * The layout for all dashboard-related routes.
 * Includes a sidebar for navigation and a main content area for dashboard pages.
 */

import DashboardSidebar from "@/components/DashboardSidebar";

/**
 * DashboardLayout Component
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The content of the dashboard page.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        {/* Persistent sidebar for dashboard navigation */}
        <DashboardSidebar />
        
        {/* Main nested route content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}