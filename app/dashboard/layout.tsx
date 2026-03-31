import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <>
    <div className="flex max-w-6xl mx-auto">
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}