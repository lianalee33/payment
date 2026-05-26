import Link from "next/link";
import { getAuthUser } from "@/app/lib/auth";
import Sidebar from "@/app/components/layout/Sidebar";
import UserMenu from "@/app/components/layout/UserMenu";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-end px-6 shrink-0">
          {user ? (
            <UserMenu email={user.email} />
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
            >
              로그인
            </Link>
          )}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
