"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Package, Save, X } from "lucide-react";
import { Product } from "@/lib/api/productsApi";
import { updateStock } from "@/lib/api/inventoryApi";

type Props = {
  product: Product;
  onClose: () => void;
  onUpdated: () => void;
};

type MovementType = "STOCK_IN" | "STOCK_OUT" | "MANUAL_ADJUSTMENT";

export default function StockUpdateModal({
  product,
  onClose,
  onUpdated,
}: Props) {
  const [movementType, setMovementType] = useState<MovementType>("STOCK_IN");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await updateStock({
        productId: product._id,
        movementType,
        quantity,
        reason,
      });

      onUpdated();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update stock.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-xl rounded-[1.5rem] bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
              <Package size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black text-red-950">Update Stock</h2>
              <p className="mt-1 text-sm text-gray-500">
                {product.name} — Current stock:{" "}
                <span className="font-bold">{product.stockQuantity}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-red-100 p-2 text-red-900 hover:bg-red-50"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Movement Type
            </label>

            <select
              value={movementType}
              onChange={(event) =>
                setMovementType(event.target.value as MovementType)
              }
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            >
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
              <option value="MANUAL_ADJUSTMENT">Manual Adjustment</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              {movementType === "MANUAL_ADJUSTMENT"
                ? "New Stock Quantity"
                : "Quantity"}
            </label>

            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
              required
            />

            {movementType === "MANUAL_ADJUSTMENT" && (
              <p className="mt-2 text-xs text-gray-500">
                Manual adjustment sets the final stock quantity directly.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Reason
            </label>

            <textarea
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Example: New stock arrived, damaged item, manual correction..."
              className="w-full resize-none rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm outline-none focus:border-red-700 focus:bg-white"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
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
              {isSubmitting ? "Updating..." : "Update Stock"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
