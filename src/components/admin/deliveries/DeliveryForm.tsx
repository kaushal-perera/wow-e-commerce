"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createDelivery, DeliveryStaff } from "@/lib/api/deliveriesApi";
import { Order } from "@/lib/api/ordersApi";

type Props = {
  orders: Order[];
  staff: DeliveryStaff[];
};

export default function DeliveryForm({ orders, staff }: Props) {
  const router = useRouter();

  const [orderId, setOrderId] = useState("");
  const [deliveryStaffId, setDeliveryStaffId] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await createDelivery({
        orderId,
        deliveryStaffId: deliveryStaffId || null,
        estimatedDeliveryDate,
        deliveryNotes,
      });

      router.push("/admin/deliveries");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create delivery.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-7"
    >
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Order
          </label>

          <select
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            required
          >
            <option value="">Select order</option>

            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.orderNumber} — Rs. {order.totalAmount} —{" "}
                {order.orderStatus}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-gray-500">
            Only confirmed, processing, packed, or dispatched orders should be
            assigned for delivery.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Delivery Staff
          </label>

          <select
            value={deliveryStaffId}
            onChange={(event) => setDeliveryStaffId(event.target.value)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
          >
            <option value="">Assign later</option>

            {staff.map((member) => (
              <option key={member._id} value={member._id}>
                {member.fullName} — {member.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Estimated Delivery Date
          </label>

          <input
            type="date"
            value={estimatedDeliveryDate}
            onChange={(event) => setEstimatedDeliveryDate(event.target.value)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Delivery Notes
          </label>

          <textarea
            rows={5}
            value={deliveryNotes}
            onChange={(event) => setDeliveryNotes(event.target.value)}
            placeholder="Add delivery instructions or notes..."
            className="w-full resize-none rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm outline-none focus:border-red-700 focus:bg-white"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/deliveries")}
            className="h-12 rounded-2xl border border-red-100 px-6 text-sm font-bold text-red-900 hover:bg-red-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-6 text-sm font-bold text-white shadow-lg shadow-red-900/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save size={18} />
            {isSubmitting ? "Creating..." : "Create Delivery"}
          </button>
        </div>
      </div>
    </form>
  );
}
