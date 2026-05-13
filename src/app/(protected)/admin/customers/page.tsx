"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search, UserCheck, UserX, Users } from "lucide-react";
import {
  Customer,
  getCustomers,
  updateCustomerStatus,
} from "@/lib/api/customersApi";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadCustomers() {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load customers.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(customer: Customer) {
    const newStatus = customer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const confirmed = window.confirm(
      `Are you sure you want to mark this customer as ${newStatus}?`,
    );

    if (!confirmed) return;

    try {
      await updateCustomerStatus(customer._id, newStatus);
      await loadCustomers();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update customer status.",
      );
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        customer.fullName.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const activeCount = customers.filter(
    (customer) => customer.status === "ACTIVE",
  ).length;

  const inactiveCount = customers.filter(
    (customer) => customer.status === "INACTIVE",
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Customer Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View customers, order history, and account status.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
            statusFilter === "ALL"
              ? "border-red-700 bg-red-900 text-white"
              : "border-red-100 bg-white text-red-950 hover:bg-red-50"
          }`}
        >
          <Users size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">
            Total Customers
          </p>
          <h2 className="mt-1 text-3xl font-black">{customers.length}</h2>
        </button>

        <button
          onClick={() => setStatusFilter("ACTIVE")}
          className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
            statusFilter === "ACTIVE"
              ? "border-green-600 bg-green-600 text-white"
              : "border-red-100 bg-white text-red-950 hover:bg-red-50"
          }`}
        >
          <UserCheck size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">
            Active Customers
          </p>
          <h2 className="mt-1 text-3xl font-black">{activeCount}</h2>
        </button>

        <button
          onClick={() => setStatusFilter("INACTIVE")}
          className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
            statusFilter === "INACTIVE"
              ? "border-red-700 bg-red-700 text-white"
              : "border-red-100 bg-white text-red-950 hover:bg-red-50"
          }`}
        >
          <UserX size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">
            Inactive Customers
          </p>
          <h2 className="mt-1 text-3xl font-black">{inactiveCount}</h2>
        </button>
      </section>

      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-12 w-full items-center rounded-2xl border border-red-100 bg-red-50/40 px-4 lg:max-w-md">
            <Search size={18} className="text-red-800" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search customers..."
              className="h-full w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <div className="flex gap-2">
            {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(status as "ALL" | "ACTIVE" | "INACTIVE")
                }
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
        ) : filteredCustomers.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
            <Users size={42} className="text-red-900" />
            <h2 className="mt-3 text-lg font-black text-red-950">
              No customers found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Registered customers will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-red-100 text-sm text-gray-500">
                    <th className="px-4 py-4 font-bold">Customer</th>
                    <th className="px-4 py-4 font-bold">Phone</th>
                    <th className="px-4 py-4 font-bold">Orders</th>
                    <th className="px-4 py-4 font-bold">Total Spent</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold">Joined</th>
                    <th className="px-4 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b border-red-50 text-sm transition hover:bg-red-50/60"
                    >
                      <td className="px-4 py-4">
                        <p className="font-bold text-red-950">
                          {customer.fullName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {customer.email}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {customer.phone || "N/A"}
                      </td>

                      <td className="px-4 py-4 font-bold text-red-950">
                        {customer.totalOrders || 0}
                      </td>

                      <td className="px-4 py-4 font-black text-red-950">
                        Rs. {customer.totalSpent || 0}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            customer.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/customers/${customer._id}`}
                            className="rounded-xl border border-red-100 p-2 text-red-900 hover:bg-red-100"
                            title="View customer"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            onClick={() => handleStatusChange(customer)}
                            className={`rounded-xl px-4 py-2 text-xs font-bold ${
                              customer.status === "ACTIVE"
                                ? "bg-red-900 text-white hover:bg-red-800"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {customer.status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 lg:hidden">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer._id}
                  className="rounded-2xl border border-red-100 bg-red-50/50 p-4"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-black text-red-950">
                        {customer.fullName}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {customer.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {customer.phone || "No phone"}
                      </p>
                    </div>

                    <span
                      className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${
                        customer.status === "ACTIVE"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Orders</p>
                      <p className="font-black text-red-950">
                        {customer.totalOrders || 0}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="font-black text-red-950">
                        Rs. {customer.totalSpent || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/customers/${customer._id}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-900"
                    >
                      <Eye size={16} />
                      View
                    </Link>

                    <button
                      onClick={() => handleStatusChange(customer)}
                      className={`rounded-xl px-3 py-2 text-sm font-bold text-white ${
                        customer.status === "ACTIVE"
                          ? "bg-red-900"
                          : "bg-green-600"
                      }`}
                    >
                      {customer.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
