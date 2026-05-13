import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import StoreNavbar from "@/components/storefront/StoreNavbar";
import StoreFooter from "@/components/storefront/StoreFooter";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import Order from "@/models/Order";

type CustomerData = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
  };
  createdAt: string;
};

async function getAccountData() {
  const authUser = await getCurrentUserFromCookie();

  if (!authUser) {
    redirect("/login");
  }

  if (authUser.role !== "CUSTOMER") {
    redirect("/admin/dashboard");
  }

  await connectDB();

  const [customer, recentOrders, allOrders] = await Promise.all([
    UserModel.findById(authUser.userId).select("-password").lean(),

    Order.find({
      customerId: authUser.userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Order.find({
      customerId: authUser.userId,
    }).lean(),
  ]);

  if (!customer) {
    redirect("/login");
  }

  const totalOrders = allOrders.length;

  const totalSpent = allOrders
    .filter((order) => order.orderStatus !== "CANCELLED")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrders = allOrders.filter(
    (order) => order.orderStatus === "PENDING",
  ).length;

  return {
    customer: JSON.parse(JSON.stringify(customer)) as CustomerData,
    orders: JSON.parse(JSON.stringify(recentOrders)),
    totalOrders,
    totalSpent,
    pendingOrders,
  };
}

function getStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700";
    case "CONFIRMED":
    case "PROCESSING":
    case "PACKED":
    case "DISPATCHED":
      return "bg-blue-50 text-blue-700";
    case "DELIVERED":
      return "bg-green-50 text-green-700";
    case "CANCELLED":
    case "RETURNED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default async function AccountPage() {
  const { customer, orders, totalOrders, totalSpent, pendingOrders } =
    await getAccountData();

  const hasAddress =
    customer.address?.line1 ||
    customer.address?.line2 ||
    customer.address?.city ||
    customer.address?.postalCode;

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <StoreNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-950 via-red-900 to-red-700 p-6 text-white shadow-xl shadow-red-950/20 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/15 text-white backdrop-blur">
                <User size={42} />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-100">
                  My Account
                </p>

                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  Welcome, {customer.fullName}
                </h1>

                <p className="mt-2 text-sm text-red-100">{customer.email}</p>
              </div>
            </div>

            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-red-950 transition hover:bg-red-50"
            >
              Continue Shopping
              <ShoppingBag size={18} />
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
              <ShoppingCart size={24} />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-500">
              Total Orders
            </p>
            <h2 className="mt-1 text-3xl font-black text-red-950">
              {totalOrders}
            </h2>
          </div>

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
              <Package size={24} />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-500">
              Pending Orders
            </p>
            <h2 className="mt-1 text-3xl font-black text-red-950">
              {pendingOrders}
            </h2>
          </div>

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
              <ShoppingBag size={24} />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-500">
              Total Spent
            </p>
            <h2 className="mt-1 text-3xl font-black text-red-950">
              Rs. {totalSpent}
            </h2>
          </div>

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
              <User size={24} />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-500">
              Account Status
            </p>
            <h2 className="mt-1 text-2xl font-black text-red-950">
              {customer.status}
            </h2>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-[2rem] border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
                  <User size={24} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-red-950">
                    Profile Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your customer account information.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-bold text-gray-500">Full Name</p>
                  <p className="mt-1 font-black text-red-950">
                    {customer.fullName}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-bold text-gray-500">Email</p>
                  <p className="mt-1 break-all font-black text-red-950">
                    {customer.email}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-bold text-gray-500">Phone</p>
                  <p className="mt-1 font-black text-red-950">
                    {customer.phone || "Not added"}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-bold text-gray-500">
                    Member Since
                  </p>
                  <p className="mt-1 font-black text-red-950">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
                  <MapPin size={24} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-red-950">
                    Default Address
                  </h2>
                  <p className="text-sm text-gray-500">
                    Used for quick checkout.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-red-50 p-4">
                {hasAddress ? (
                  <p className="text-sm font-bold leading-6 text-red-950">
                    {customer.address?.line1}
                    {customer.address?.line2
                      ? `, ${customer.address.line2}`
                      : ""}
                    {customer.address?.city ? `, ${customer.address.city}` : ""}
                    {customer.address?.postalCode
                      ? `, ${customer.address.postalCode}`
                      : ""}
                  </p>
                ) : (
                  <p className="text-sm font-bold text-gray-500">
                    No default address added yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-[2rem] border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-black text-red-950">
                    Recent Orders
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Your latest WOW purchases.
                  </p>
                </div>

                <Link
                  href="/account/orders"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-900 px-5 text-sm font-black text-white hover:bg-red-800"
                >
                  View All Orders
                  <ArrowRight size={17} />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
                  <ShoppingCart size={48} className="text-red-900" />
                  <h3 className="mt-4 text-xl font-black text-red-950">
                    No orders yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Start shopping and your orders will appear here.
                  </p>

                  <Link
                    href="/products"
                    className="mt-6 rounded-2xl bg-red-900 px-6 py-3 text-sm font-black text-white"
                  >
                    Shop Products
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {orders.map((order: any) => (
                    <div
                      key={order._id}
                      className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-black text-red-950">
                          {order.orderNumber}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                          {order.items.length} item(s)
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                        <p className="font-black text-red-950">
                          Rs. {order.totalAmount}
                        </p>

                        <Link
                          href={`/account/orders/${order._id}`}
                          className="rounded-xl bg-red-900 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/products"
                className="group rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
                  <ShoppingBag size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-red-950">
                  Browse Products
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Continue shopping and discover more WOW products.
                </p>
              </Link>

              <Link
                href="/cart"
                className="group rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
                  <ShoppingCart size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-red-950">
                  View Cart
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Check your cart and proceed to checkout.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
