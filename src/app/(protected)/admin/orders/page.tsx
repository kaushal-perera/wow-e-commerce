"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, PackageCheck, Search, ShoppingCart } from "lucide-react";
import { getOrders, Order } from "@/lib/api/ordersApi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadOrders() {
    try {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load orders.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm.toLowerCase();

      const customer =
        typeof order.customerId === "object" ? order.customerId : null;

      const matchesSearch =
        order.orderNumber.toLowerCase().includes(search) ||
        customer?.fullName?.toLowerCase().includes(search) ||
        customer?.email?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const pendingCount = orders.filter(
    (order) => order.orderStatus === "PENDING",
  ).length;

  const confirmedCount = orders.filter(
    (order) => order.orderStatus === "CONFIRMED",
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.orderStatus === "DELIVERED",
  ).length;

  const cancelledCount = orders.filter(
    (order) => order.orderStatus === "CANCELLED",
  ).length;

  function getStatusClass(status: string) {
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

  function getPaymentClass(status: string) {
    switch (status) {
      case "PAID":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "FAILED":
      case "REFUNDED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <ShoppingCart size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage customer orders.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pending", value: pendingCount, status: "PENDING" },
          { label: "Confirmed", value: confirmedCount, status: "CONFIRMED" },
          { label: "Delivered", value: deliveredCount, status: "DELIVERED" },
          { label: "Cancelled", value: cancelledCount, status: "CANCELLED" },
        ].map((item) => (
          <button
            key={item.status}
            onClick={() => setStatusFilter(item.status)}
            className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
              statusFilter === item.status
                ? "border-red-700 bg-red-900 text-white"
                : "border-red-100 bg-white text-red-950 hover:bg-red-50"
            }`}
          >
            <PackageCheck size={24} />
            <p className="mt-3 text-sm font-semibold opacity-80">
              {item.label}
            </p>
            <h2 className="mt-1 text-3xl font-black">{item.value}</h2>
          </button>
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-12 w-full items-center rounded-2xl border border-red-100 bg-red-50/40 px-4 lg:max-w-md">
            <Search size={18} className="text-red-800" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by order number or customer..."
              className="h-full w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              "ALL",
              "PENDING",
              "CONFIRMED",
              "PROCESSING",
              "PACKED",
              "DISPATCHED",
              "DELIVERED",
              "CANCELLED",
              "RETURNED",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`h-10 rounded-xl px-4 text-xs font-bold ${
                  statusFilter === status
                    ? "bg-red-900 text-white"
                    : "bg-red-50 text-red-900 hover:bg-red-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-2xl bg-red-50"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
            <ShoppingCart size={42} className="text-red-900" />
            <h2 className="mt-3 text-lg font-black text-red-950">
              No orders found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-red-100 text-sm text-gray-500">
                    <th className="px-4 py-4 font-bold">Order</th>
                    <th className="px-4 py-4 font-bold">Customer</th>
                    <th className="px-4 py-4 font-bold">Amount</th>
                    <th className="px-4 py-4 font-bold">Order Status</th>
                    <th className="px-4 py-4 font-bold">Payment</th>
                    <th className="px-4 py-4 font-bold">Date</th>
                    <th className="px-4 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const customer =
                      typeof order.customerId === "object"
                        ? order.customerId
                        : null;

                    return (
                      <tr
                        key={order._id}
                        className="border-b border-red-50 text-sm transition hover:bg-red-50/60"
                      >
                        <td className="px-4 py-4">
                          <p className="font-bold text-red-950">
                            {order.orderNumber}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.items.length} item(s)
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-bold text-red-950">
                            {customer?.fullName || "Customer"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {customer?.email || "N/A"}
                          </p>
                        </td>

                        <td className="px-4 py-4 font-black text-red-950">
                          Rs. {order.totalAmount}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              order.orderStatus,
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getPaymentClass(
                              order.paymentStatus,
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="rounded-xl border border-red-100 p-2 text-red-900 hover:bg-red-100"
                            >
                              <Eye size={17} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 lg:hidden">
              {filteredOrders.map((order) => {
                const customer =
                  typeof order.customerId === "object"
                    ? order.customerId
                    : null;

                return (
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
                          {customer?.fullName || "Customer"}
                        </p>
                      </div>

                      <span
                        className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
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
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-900 px-3 py-2 text-sm font-bold text-white"
                    >
                      <Eye size={16} />
                      View Order
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
