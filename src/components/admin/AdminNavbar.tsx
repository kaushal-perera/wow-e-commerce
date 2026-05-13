"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  UserCircle,
  X,
  LayoutDashboard,
  Layers3,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  UserSquare2Icon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const mobileMenuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers3,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Warehouse,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserSquare2Icon,
  },
];

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-red-100 bg-white/90 backdrop-blur">
        <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:ml-72 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-xl border border-red-100 p-2 text-red-900 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-lg font-black text-red-950 sm:text-2xl">
                Admin Dashboard
              </h2>
              <p className="hidden text-sm text-gray-500 sm:block">
                Manage your WOW e-commerce system
              </p>
            </div>
          </div>

          <div className="hidden max-w-md flex-1 items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 lg:flex">
            <Search size={18} className="text-red-800" />
            <input
              type="text"
              placeholder="Search..."
              className="h-11 w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="relative rounded-xl border border-red-100 p-2.5 text-red-900 transition hover:bg-red-50">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600" />
            </button>

            <button className="hidden rounded-xl border border-red-100 p-2.5 text-red-900 transition hover:bg-red-50 sm:block">
              <UserCircle size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-950 p-2.5 text-white transition hover:bg-red-800"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl">
            <div className="flex h-20 items-center justify-between border-b border-red-100 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-950 text-white">
                  <ShoppingBag size={24} />
                </div>

                <div>
                  <h1 className="text-xl font-black text-red-950">WOW</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl border border-red-100 p-2 text-red-900"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1 px-4 py-5">
              {mobileMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-gradient-to-r from-red-700 to-red-950 text-white"
                        : "text-gray-600 hover:bg-red-50 hover:text-red-900"
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
