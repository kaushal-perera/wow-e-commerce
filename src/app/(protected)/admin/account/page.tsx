import { getCurrentUserFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const user = await getCurrentUserFromCookie();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-red-50/40 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl shadow-red-950/10">
        <h1 className="text-3xl font-bold text-red-950">My Account</h1>

        <p className="mt-3 text-gray-600">
          Welcome back, <span className="font-semibold">{user.email}</span>
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <h2 className="font-semibold text-red-950">Orders</h2>
            <p className="mt-2 text-sm text-gray-600">
              View your order history.
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <h2 className="font-semibold text-red-950">Profile</h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage your personal details.
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <h2 className="font-semibold text-red-950">Addresses</h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage delivery addresses.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
