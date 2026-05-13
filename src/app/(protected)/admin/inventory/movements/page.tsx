"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, History, Package, Search } from "lucide-react";
import Link from "next/link";
import {
  getInventoryMovements,
  InventoryMovement,
} from "@/lib/api/inventoryApi";

export default function InventoryMovementsPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadMovements() {
    try {
      setIsLoading(true);
      const data = await getInventoryMovements();
      setMovements(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load movement history.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
  }, []);

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const search = searchTerm.toLowerCase();

      return (
        movement.productId?.name?.toLowerCase().includes(search) ||
        movement.productId?.sku?.toLowerCase().includes(search) ||
        movement.movementType.toLowerCase().includes(search)
      );
    });
  }, [movements, searchTerm]);

  function getMovementClass(type: string) {
    if (type === "STOCK_IN" || type === "ORDER_CANCEL_RESTORE") {
      return "bg-green-50 text-green-700";
    }

    if (type === "STOCK_OUT" || type === "ORDER_DEDUCTION") {
      return "bg-red-50 text-red-700";
    }

    return "bg-yellow-50 text-yellow-700";
  }

  function formatMovementType(type: string) {
    return type.replaceAll("_", " ");
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <History size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Stock Movement History
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track all stock changes and inventory adjustments.
            </p>
          </div>
        </div>

        <Link
          href="/admin/inventory"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 hover:bg-red-50"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </section>

      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-12 w-full items-center rounded-2xl border border-red-100 bg-red-50/40 px-4 sm:max-w-md">
            <Search size={18} className="text-red-800" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search movements..."
              className="h-full w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <p className="text-sm font-semibold text-gray-500">
            Total: {filteredMovements.length}
          </p>
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
        ) : filteredMovements.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
            <History size={42} className="text-red-900" />
            <h2 className="mt-3 text-lg font-black text-red-950">
              No stock movement found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Stock updates will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-red-100 text-sm text-gray-500">
                    <th className="px-4 py-4 font-bold">Product</th>
                    <th className="px-4 py-4 font-bold">Movement</th>
                    <th className="px-4 py-4 font-bold">Previous</th>
                    <th className="px-4 py-4 font-bold">Changed</th>
                    <th className="px-4 py-4 font-bold">New</th>
                    <th className="px-4 py-4 font-bold">Updated By</th>
                    <th className="px-4 py-4 font-bold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMovements.map((movement) => (
                    <tr
                      key={movement._id}
                      className="border-b border-red-50 text-sm transition hover:bg-red-50/60"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-red-100 text-red-900">
                            {movement.productId?.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={movement.productId.images[0]}
                                alt={movement.productId.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package size={20} />
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-red-950">
                              {movement.productId?.name || "Deleted Product"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              SKU: {movement.productId?.sku || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getMovementClass(
                            movement.movementType,
                          )}`}
                        >
                          {formatMovementType(movement.movementType)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {movement.previousQuantity}
                      </td>

                      <td className="px-4 py-4 font-bold">
                        {movement.changedQuantity > 0
                          ? `+${movement.changedQuantity}`
                          : movement.changedQuantity}
                      </td>

                      <td className="px-4 py-4 font-black text-red-950">
                        {movement.newQuantity}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {movement.updatedBy?.fullName || "System"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {new Date(movement.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 lg:hidden">
              {filteredMovements.map((movement) => (
                <div
                  key={movement._id}
                  className="rounded-2xl border border-red-100 bg-red-50/50 p-4"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-black text-red-950">
                        {movement.productId?.name || "Deleted Product"}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        SKU: {movement.productId?.sku || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${getMovementClass(
                        movement.movementType,
                      )}`}
                    >
                      {formatMovementType(movement.movementType)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="font-black text-red-950">
                        {movement.previousQuantity}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Changed</p>
                      <p className="font-black text-red-950">
                        {movement.changedQuantity > 0
                          ? `+${movement.changedQuantity}`
                          : movement.changedQuantity}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">New</p>
                      <p className="font-black text-red-950">
                        {movement.newQuantity}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Updated by: {movement.updatedBy?.fullName || "System"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(movement.createdAt).toLocaleString()}
                  </p>

                  {movement.reason && (
                    <p className="mt-3 rounded-xl bg-white p-3 text-sm text-gray-600">
                      {movement.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
