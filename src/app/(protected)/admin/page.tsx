import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";
import { redirect } from "next/navigation";
import { Package, ShoppingCart, Users, Warehouse } from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUserFromCookie();

  if (!user) {
    redirect("/login");
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    redirect("/account");
  }

  const cards = [
    {
      title: "Products",
      value: "0",
      icon: Package,
    },
    {
      title: "Orders",
      value: "0",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: "0",
      icon: Users,
    },
    {
      title: "Low Stock",
      value: "0",
      icon: Warehouse,
    },
  ];

  return (
    <main className="min-h-screen bg-red-50/40">
      <header className="bg-gradient-to-r from-red-950 via-red-900 to-red-700 px-6 py-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">WOW Admin Dashboard</h1>
        <p className="mt-1 text-sm text-red-100">
          Manage inventory, customers, and online orders.
        </p>
      </header>

      <section className="p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>
                    <h2 className="mt-2 text-4xl font-bold text-red-950">
                      {card.value}
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-900">
                    <Icon size={28} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
          <h2 className="text-xl font-bold text-red-950">Next Steps</h2>

          <ul className="mt-4 space-y-3 text-gray-600">
            <li>1. Create Category Management module.</li>
            <li>2. Create Product Management module.</li>
            <li>3. Connect inventory stock quantity.</li>
            <li>4. Build customer product browsing page.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
