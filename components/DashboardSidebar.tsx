/**
 * components/DashboardSidebar.tsx
 * 
 * A navigation sidebar for the organizer dashboard.
 * Provides links to manage events and create new registrations.
 */

import Link from "next/link";

/**
 * DashboardSidebar Component
 * 
 * Renders the sidebar navigation for the /dashboard route.
 */
export default function DashboardSidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 p-6">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Dashboard</h2>

      <nav className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100"
        >
          My Events
        </Link>

        <Link
          href="/dashboard/events/create"
          className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100"
        >
          Create Event
        </Link>
      </nav>
    </aside>
  );
}