"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Plus,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Delivery, getDeliveries } from "@/lib/api/deliveriesApi";

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadDeliveries() {
    try {
      setIsLoading(true);
      const data = await getDeliveries();
      setDeliveries(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load deliveries.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDeliveries();
  }, []);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const search = searchTerm.toLowerCase();

      const customer = delivery.orderId?.customerId;

      const matchesSearch =
        delivery.trackingNumber.toLowerCase().includes(search) ||
        delivery.orderId?.orderNumber?.toLowerCase().includes(search) ||
        customer?.fullName?.toLowerCase().includes(search) ||
        delivery.deliveryStaffId?.fullName?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || delivery.deliveryStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deliveries, searchTerm, statusFilter]);

  const pendingCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "PENDING",
  ).length;

  const assignedCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "ASSIGNED",
  ).length;

  const deliveredCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "DELIVERED",
  ).length;

  const failedCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "FAILED",
  ).length;

  function getStatusClass(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "ASSIGNED":
        return "bg-blue-50 text-blue-700";
      case "PICKED_UP":
        return "bg-purple-50 text-purple-700";
      case "IN_TRANSIT":
        return "bg-orange-50 text-orange-700";
      case "DELIVERED":
        return "bg-green-50 text-green-700";
      case "FAILED":
      case "RETURNED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Truck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Delivery Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Assign delivery staff and track order deliveries.
            </p>
          </div>
        </div>

        <Link
          href="/admin/deliveries/create"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-5 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:from-red-800 hover:to-red-950"
        >
          <Plus size={18} />
          Create Delivery
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Pending",
            value: pendingCount,
            status: "PENDING",
            icon: Clock,
          },
          {
            label: "Assigned",
            value: assignedCount,
            status: "ASSIGNED",
            icon: Truck,
          },
          {
            label: "Delivered",
            value: deliveredCount,
            status: "DELIVERED",
            icon: CheckCircle2,
          },
          {
            label: "Failed",
            value: failedCount,
            status: "FAILED",
            icon: XCircle,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.status}
              onClick={() => setStatusFilter(item.status)}
              className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
                statusFilter === item.status
                  ? "border-red-700 bg-red-900 text-white"
                  : "border-red-100 bg-white text-red-950 hover:bg-red-50"
              }`}
            >
              <Icon size={24} />
              <p className="mt-3 text-sm font-semibold opacity-80">
                {item.label}
              </p>
              <h2 className="mt-1 text-3xl font-black">{item.value}</h2>
            </button>
          );
        })}
      </section>

      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-12 w-full items-center rounded-2xl border border-red-100 bg-red-50/40 px-4 lg:max-w-md">
            <Search size={18} className="text-red-800" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search tracking, order, customer, staff..."
              className="h-full w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              "ALL",
              "PENDING",
              "ASSIGNED",
              "PICKED_UP",
              "IN_TRANSIT",
              "DELIVERED",
              "FAILED",
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
        ) : filteredDeliveries.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
            <Truck size={42} className="text-red-900" />
            <h2 className="mt-3 text-lg font-black text-red-950">
              No deliveries found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a delivery for an order.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-red-100 text-sm text-gray-500">
                    <th className="px-4 py-4 font-bold">Tracking</th>
                    <th className="px-4 py-4 font-bold">Order</th>
                    <th className="px-4 py-4 font-bold">Customer</th>
                    <th className="px-4 py-4 font-bold">Staff</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold">Estimated</th>
                    <th className="px-4 py-4 text-right font-bold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery._id}
                      className="border-b border-red-50 text-sm transition hover:bg-red-50/60"
                    >
                      <td className="px-4 py-4">
                        <p className="font-bold text-red-950">
                          {delivery.trackingNumber}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Created{" "}
                          {new Date(delivery.createdAt).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {delivery.orderId?.orderNumber}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold text-red-950">
                          {delivery.orderId?.customerId?.fullName || "Customer"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {delivery.orderId?.deliveryAddress?.phone || "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {delivery.deliveryStaffId?.fullName || "Unassigned"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            delivery.deliveryStatus,
                          )}`}
                        >
                          {delivery.deliveryStatus}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {delivery.estimatedDeliveryDate
                          ? new Date(
                              delivery.estimatedDeliveryDate,
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/admin/deliveries/${delivery._id}`}
                          className="inline-flex rounded-xl border border-red-100 p-2 text-red-900 hover:bg-red-100"
                        >
                          <Eye size={17} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 lg:hidden">
              {filteredDeliveries.map((delivery) => (
                <div
                  key={delivery._id}
                  className="rounded-2xl border border-red-100 bg-red-50/50 p-4"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-black text-red-950">
                        {delivery.trackingNumber}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {delivery.orderId?.orderNumber}
                      </p>
                    </div>

                    <span
                      className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        delivery.deliveryStatus,
                      )}`}
                    >
                      {delivery.deliveryStatus}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-black text-red-950">
                        {delivery.orderId?.customerId?.fullName || "Customer"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Staff</p>
                      <p className="font-black text-red-950">
                        {delivery.deliveryStaffId?.fullName || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/admin/deliveries/${delivery._id}`}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-900 px-3 py-2 text-sm font-bold text-white"
                  >
                    <Eye size={16} />
                    View Delivery
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
