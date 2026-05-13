import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  User,
  UserCheck,
  UserX,
} from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import Order from "@/models/Order";
import { USER_ROLES } from "@/lib/roles";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getCustomer(id: string) {
  await connectDB();

  const customer = await UserModel.findOne({
    _id: id,
    role: USER_ROLES.CUSTOMER,
  })
    .select("-password")
    .lean();

  if (!customer) {
    notFound();
  }

  const orders = await Order.find({
    customerId: id,
  })
    .sort({ createdAt: -1 })
    .lean();

  const totalOrders = orders.length;

  const totalSpent = orders
    .filter((order) => order.orderStatus !== "CANCELLED")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return {
    customer: JSON.parse(JSON.stringify(customer)),
    orders: JSON.parse(JSON.stringify(orders)),
    totalOrders,
    totalSpent,
  };
}

function getOrderStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700";
    case "PROCESSING":
      return "bg-purple-50 text-purple-700";
    case "PACKED":
      return "bg-indigo-50 text-indigo-700";
    case "DISPATCHED":
      return "bg-orange-50 text-orange-700";
    case "DELIVERED":
      return "bg-green-50 text-green-700";
    case "CANCELLED":
    case "RETURNED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default async function AdminCustomerDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const { customer, orders, totalOrders, totalSpent } = await getCustomer(id);

  const address = customer.address;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <User size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Customer Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View customer details and order history.
            </p>
          </div>
        </div>

        <Link
          href="/admin/customers"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 hover:bg-red-50"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-red-700 to-red-950 text-white shadow-lg shadow-red-900/20">
                <User size={44} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-red-950">
                {customer.fullName}
              </h2>

              <p className="mt-1 text-sm text-gray-500">{customer.email}</p>

              <span
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                  customer.status === "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {customer.status === "ACTIVE" ? (
                  <UserCheck size={15} />
                ) : (
                  <UserX size={15} />
                )}
                {customer.status}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-red-50 p-4 text-center">
                <p className="text-xs font-semibold text-gray-500">
                  Total Orders
                </p>
                <p className="mt-1 text-2xl font-black text-red-950">
                  {totalOrders}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4 text-center">
                <p className="text-xs font-semibold text-gray-500">
                  Total Spent
                </p>
                <p className="mt-1 text-2xl font-black text-red-950">
                  Rs. {totalSpent}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <h3 className="text-lg font-black text-red-950">Contact Details</h3>

            <div className="mt-5 space-y-4">
              <div className="flex gap-3 rounded-2xl bg-red-50 p-4">
                <Mail className="mt-0.5 text-red-900" size={20} />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Email</p>
                  <p className="mt-1 break-all font-bold text-red-950">
                    {customer.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl bg-red-50 p-4">
                <Phone className="mt-0.5 text-red-900" size={20} />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Phone</p>
                  <p className="mt-1 font-bold text-red-950">
                    {customer.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl bg-red-50 p-4">
                <MapPin className="mt-0.5 text-red-900" size={20} />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Address</p>

                  {address?.line1 || address?.city ? (
                    <p className="mt-1 text-sm font-bold leading-6 text-red-950">
                      {address?.line1}
                      {address?.line2 ? `, ${address.line2}` : ""}
                      {address?.city ? `, ${address.city}` : ""}
                      {address?.postalCode ? `, ${address.postalCode}` : ""}
                    </p>
                  ) : (
                    <p className="mt-1 font-bold text-red-950">
                      No address added
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-red-50 p-4">
              <p className="text-xs font-semibold text-gray-500">
                Registered Date
              </p>
              <p className="mt-1 font-bold text-red-950">
                {new Date(customer.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-900">
                <ShoppingCart size={22} />
              </div>

              <div>
                <h2 className="text-lg font-black text-red-950">
                  Order History
                </h2>
                <p className="text-sm text-gray-500">
                  Orders placed by this customer.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
                <ShoppingCart size={42} className="text-red-900" />
                <h3 className="mt-3 text-lg font-black text-red-950">
                  No orders yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customer order history will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 hidden overflow-x-auto lg:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-red-100 text-sm text-gray-500">
                        <th className="px-4 py-4 font-bold">Order</th>
                        <th className="px-4 py-4 font-bold">Items</th>
                        <th className="px-4 py-4 font-bold">Total</th>
                        <th className="px-4 py-4 font-bold">Status</th>
                        <th className="px-4 py-4 font-bold">Date</th>
                        <th className="px-4 py-4 text-right font-bold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order: any) => (
                        <tr
                          key={order._id}
                          className="border-b border-red-50 text-sm transition hover:bg-red-50/60"
                        >
                          <td className="px-4 py-4">
                            <p className="font-bold text-red-950">
                              {order.orderNumber}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {order.paymentMethod}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-gray-600">
                            {order.items.length}
                          </td>

                          <td className="px-4 py-4 font-black text-red-950">
                            Rs. {order.totalAmount}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusClass(
                                order.orderStatus,
                              )}`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="rounded-xl bg-red-900 px-4 py-2 text-xs font-bold text-white hover:bg-red-800"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 space-y-3 lg:hidden">
                  {orders.map((order: any) => (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-red-100 bg-red-50/50 p-4"
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-black text-red-950">
                            {order.orderNumber}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.items.length} item(s)
                          </p>
                        </div>

                        <span
                          className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusClass(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="font-black text-red-950">
                            Rs. {order.totalAmount}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-xs text-gray-500">Payment</p>
                          <p className="font-black text-red-950">
                            {order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="mt-4 flex items-center justify-center rounded-xl bg-red-900 px-3 py-2 text-sm font-bold text-white"
                      >
                        View Order
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
