import { ProfileSidebar } from '@/components/profile/ProfileSidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="shrink-0">
            <ProfileSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full min-h-[500px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
