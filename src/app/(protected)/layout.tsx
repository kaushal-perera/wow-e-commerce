import { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";
import { Poppins } from "next/font/google";
import "../../app/globals.css";

type Props = {
  children: ReactNode;
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function AdminLayout({ children }: Props) {
  const user = await getCurrentUserFromCookie();

  if (!user) {
    redirect("/login");
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    redirect("/admin");
  }

  return (
    <html lang="en" className={poppins.className}>
      <body className="min-h-full flex flex-col">
        <div className="min-h-screen bg-[#fff7f7]">
          <AdminSidebar />
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:ml-72 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
