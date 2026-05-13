"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Order,
  OrderStatus,
  PaymentStatus,
  updateOrder,
} from "@/lib/api/ordersApi";
import { Save } from "lucide-react";

type Props = {
  order: Order;
};

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

export default function OrderStatusForm({ order }: Props) {
  const router = useRouter();

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    order.orderStatus,
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order.paymentStatus,
  );
  const [notes, setNotes] = useState(order.notes || "");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await updateOrder(order._id, {
        orderStatus,
        paymentStatus,
        notes,
      });

      setMessage("Order updated successfully.");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5"
    >
      <h2 className="text-lg font-black text-red-950">Update Order</h2>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Order Status
          </label>

          <select
            value={orderStatus}
            onChange={(event) =>
              setOrderStatus(event.target.value as OrderStatus)
            }
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-gray-500">
            Stock deducts when status becomes CONFIRMED. Stock restores when
            status becomes CANCELLED or RETURNED.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Payment Status
          </label>

          <select
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(event.target.value as PaymentStatus)
            }
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm outline-none focus:border-red-700 focus:bg-white"
            placeholder="Add order notes..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-6 text-sm font-bold text-white shadow-lg shadow-red-900/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
