"use client";

import { getMyOrders, Order } from "@/lib/api/ordersApi";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  orderId: string;
};

export default function CustomerOrderDetailsClient({ orderId }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadOrder() {
    try {
      setIsLoading(true);
      const orders = await getMyOrders();
      const selectedOrder = orders.find((item) => item._id === orderId);

      if (!selectedOrder) {
        setError("Order not found.");
        return;
      }

      setOrder(selectedOrder);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load order.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-24 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-red-950/5">
        <ShoppingCart size={48} className="text-red-900" />
        <h1 className="mt-4 text-2xl font-black text-red-950">
          {error || "Order not found"}
        </h1>

        <Link
          href="/account/orders"
          className="mt-6 rounded-2xl bg-red-900 px-6 py-3 text-sm font-black text-white"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-red-100 bg-white p-5 shadow-xl shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-3xl font-black text-red-950">
            {order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Ordered on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <Link
          href="/account/orders"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 hover:bg-red-50"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-xl shadow-red-950/5 sm:p-6">
          <h2 className="text-xl font-black text-red-950">Order Items</h2>

          <div className="mt-5 space-y-4">
            {order.items.map((item, index) => (
              <div
                key={`${item.productSku}-${index}`}
                className="flex gap-4 rounded-2xl bg-red-50 p-4"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-red-900">
                  {item.productImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package size={24} />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-black text-red-950">
                      {item.productName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      SKU: {item.productSku}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity} × Rs. {item.price}
                    </p>
                  </div>

                  <p className="font-black text-red-950">Rs. {item.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
          <h2 className="text-xl font-black text-red-950">Summary</h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Status</span>
              <span className="font-black text-red-950">
                {order.orderStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="font-black text-red-950">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-black text-red-950">
                {order.paymentMethod}
              </span>
            </div>

            <div className="border-t border-red-100 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-black text-red-950">
                  Rs. {order.subtotal}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-black text-red-950">
                  Rs. {order.deliveryFee}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-lg">
                <span className="font-black text-red-950">Total</span>
                <span className="font-black text-red-950">
                  Rs. {order.totalAmount}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-red-50 p-4">
            <p className="text-xs font-bold text-gray-500">Delivery Address</p>
            <p className="mt-2 text-sm font-bold leading-6 text-red-950">
              {order.deliveryAddress.fullName}
              <br />
              {order.deliveryAddress.phone}
              <br />
              {order.deliveryAddress.line1}
              {order.deliveryAddress.line2
                ? `, ${order.deliveryAddress.line2}`
                : ""}
              , {order.deliveryAddress.city}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
