"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Delivery,
  DeliveryStaff,
  DeliveryStatus,
  updateDelivery,
} from "@/lib/api/deliveriesApi";
import { Save } from "lucide-react";

type Props = {
  delivery: Delivery;
  staff: DeliveryStaff[];
};

const statuses: DeliveryStatus[] = [
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "FAILED",
  "RETURNED",
];

export default function DeliveryUpdateForm({ delivery, staff }: Props) {
  const router = useRouter();

  const [deliveryStaffId, setDeliveryStaffId] = useState(
    delivery.deliveryStaffId?._id || "",
  );
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(
    delivery.deliveryStatus,
  );
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    delivery.estimatedDeliveryDate
      ? delivery.estimatedDeliveryDate.slice(0, 10)
      : "",
  );
  const [deliveryNotes, setDeliveryNotes] = useState(
    delivery.deliveryNotes || "",
  );

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await updateDelivery(delivery._id, {
        deliveryStaffId: deliveryStaffId || null,
        deliveryStatus,
        estimatedDeliveryDate,
        deliveryNotes,
      });

      setMessage("Delivery updated successfully.");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update delivery.",
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
      <h2 className="text-lg font-black text-red-950">Update Delivery</h2>

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
            Delivery Staff
          </label>

          <select
            value={deliveryStaffId}
            onChange={(event) => setDeliveryStaffId(event.target.value)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
          >
            <option value="">Unassigned</option>

            {staff.map((member) => (
              <option key={member._id} value={member._id}>
                {member.fullName} — {member.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Delivery Status
          </label>

          <select
            value={deliveryStatus}
            onChange={(event) =>
              setDeliveryStatus(event.target.value as DeliveryStatus)
            }
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-gray-500">
            DELIVERED will also update the order as delivered. For COD orders,
            payment will be marked as paid.
          </p>
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
            value={deliveryNotes}
            onChange={(event) => setDeliveryNotes(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm outline-none focus:border-red-700 focus:bg-white"
            placeholder="Add delivery notes..."
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
