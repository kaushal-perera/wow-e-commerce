"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers3,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Truck,
  BarChart3,
  Settings,
  ShoppingBag,
  UserSquare2,
} from "lucide-react";

const menuItems = [
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
    label: "Deliveries",
    href: "/admin/deliveries",
    icon: Truck,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserSquare2,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-red-100 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-red-100 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-950 text-white shadow-lg shadow-red-900/20">
            <ShoppingBag size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">WOW</h1>
            <p className="text-xs font-medium text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-red-700 to-red-950 text-white shadow-lg shadow-red-900/20"
                    : "text-gray-600 hover:bg-red-50 hover:text-red-900"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-red-100 p-4">
          <div className="rounded-2xl bg-red-50 p-4">
            <p className="text-sm font-bold text-red-950">WOW System</p>
            <p className="mt-1 text-xs text-gray-500">
              Manage shop inventory and online orders.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
