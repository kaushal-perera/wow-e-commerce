"use client";

import { getMyOrders, Order } from "@/lib/api/ordersApi";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CustomerOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadOrders() {
    try {
      setIsLoading(true);
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load your orders.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

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

  return (
    <section className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-xl shadow-red-950/5 sm:p-6">
      <h1 className="text-3xl font-black text-red-950">My Orders</h1>
      <p className="mt-2 text-sm text-gray-500">
        View and track your WOW orders.
      </p>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error.includes("Unauthorized")
            ? "Please login to view your orders."
            : error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl bg-red-50"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
          <ShoppingCart size={48} className="text-red-900" />
          <h2 className="mt-4 text-xl font-black text-red-950">
            No orders yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Start shopping and place your first order.
          </p>

          <Link
            href="/products"
            className="mt-6 rounded-2xl bg-red-900 px-6 py-3 text-sm font-black text-white"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-black text-red-950">{order.orderNumber}</h2>
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
                  className="inline-flex items-center gap-2 rounded-xl bg-red-900 px-4 py-2 text-sm font-bold text-white"
                >
                  <Eye size={16} />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
