"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Edit,
  Eye,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import {
  getStaffUsers,
  StaffUser,
  updateStaffUserStatus,
} from "@/lib/api/usersApi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadUsers() {
    try {
      setIsLoading(true);
      const data = await getStaffUsers();
      setUsers(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load staff users.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(user: StaffUser) {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const confirmed = window.confirm(
      `Are you sure you want to mark ${user.fullName} as ${newStatus}?`,
    );

    if (!confirmed) return;

    try {
      await updateStaffUserStatus(user._id, newStatus);
      await loadUsers();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update user status.",
      );
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        user.fullName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const activeCount = users.filter((user) => user.status === "ACTIVE").length;
  const inactiveCount = users.filter(
    (user) => user.status === "INACTIVE",
  ).length;

  function getRoleLabel(role: string) {
    return role.replaceAll("_", " ");
  }

  function getRoleClass(role: string) {
    switch (role) {
      case "ADMIN":
        return "bg-red-50 text-red-700";
      case "INVENTORY_MANAGER":
        return "bg-purple-50 text-purple-700";
      case "SALES_STAFF":
        return "bg-blue-50 text-blue-700";
      case "DELIVERY_STAFF":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Staff/User Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage internal WOW system users.
            </p>
          </div>
        </div>

        <Link
          href="/admin/users/create"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-5 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:from-red-800 hover:to-red-950"
        >
          <Plus size={18} />
          Add Staff User
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => setRoleFilter("ALL")}
          className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
            roleFilter === "ALL"
              ? "border-red-700 bg-red-900 text-white"
              : "border-red-100 bg-white text-red-950 hover:bg-red-50"
          }`}
        >
          <ShieldCheck size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">Total Staff</p>
          <h2 className="mt-1 text-3xl font-black">{users.length}</h2>
        </button>

        <button
          onClick={() => setRoleFilter("ALL")}
          className="rounded-[1.5rem] border border-red-100 bg-white p-5 text-left text-red-950 shadow-lg shadow-red-950/5 hover:bg-red-50"
        >
          <UserCheck size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">Active</p>
          <h2 className="mt-1 text-3xl font-black">{activeCount}</h2>
        </button>

        <button
          onClick={() => setRoleFilter("ALL")}
          className="rounded-[1.5rem] border border-red-100 bg-white p-5 text-left text-red-950 shadow-lg shadow-red-950/5 hover:bg-red-50"
        >
          <UserX size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">Inactive</p>
          <h2 className="mt-1 text-3xl font-black">{inactiveCount}</h2>
        </button>
      </section>

      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex h-12 w-full items-center rounded-2xl border border-red-100 bg-red-50/40 px-4 xl:max-w-md">
            <Search size={18} className="text-red-800" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search staff users..."
              className="h-full w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              "ALL",
              "ADMIN",
              "INVENTORY_MANAGER",
              "SALES_STAFF",
              "DELIVERY_STAFF",
            ].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`h-10 whitespace-nowrap rounded-xl px-4 text-xs font-bold ${
                  roleFilter === role
                    ? "bg-red-900 text-white"
                    : "bg-red-50 text-red-900 hover:bg-red-100"
                }`}
              >
                {role.replaceAll("_", " ")}
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
        ) : filteredUsers.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
            <Users size={42} className="text-red-900" />
            <h2 className="mt-3 text-lg font-black text-red-950">
              No staff users found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create your first internal system user.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-red-100 text-sm text-gray-500">
                    <th className="px-4 py-4 font-bold">User</th>
                    <th className="px-4 py-4 font-bold">Phone</th>
                    <th className="px-4 py-4 font-bold">Role</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold">Created</th>
                    <th className="px-4 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-red-50 text-sm transition hover:bg-red-50/60"
                    >
                      <td className="px-4 py-4">
                        <p className="font-bold text-red-950">
                          {user.fullName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {user.phone || "N/A"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(
                            user.role,
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            user.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="rounded-xl border border-red-100 p-2 text-red-900 hover:bg-red-100"
                          >
                            <Eye size={17} />
                          </Link>

                          <Link
                            href={`/admin/users/${user._id}/edit`}
                            className="rounded-xl border border-red-100 p-2 text-red-900 hover:bg-red-100"
                          >
                            <Edit size={17} />
                          </Link>

                          <button
                            onClick={() => handleStatusChange(user)}
                            className={`rounded-xl px-4 py-2 text-xs font-bold ${
                              user.status === "ACTIVE"
                                ? "bg-red-900 text-white hover:bg-red-800"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {user.status === "ACTIVE"
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
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-2xl border border-red-100 bg-red-50/50 p-4"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-black text-red-950">
                        {user.fullName}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{user.email}</p>
                    </div>

                    <span
                      className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${
                        user.status === "ACTIVE"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(
                        user.role,
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/admin/users/${user._id}`}
                      className="flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-900"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/users/${user._id}/edit`}
                      className="flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-900"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleStatusChange(user)}
                      className={`rounded-xl px-3 py-2 text-sm font-bold text-white ${
                        user.status === "ACTIVE" ? "bg-red-900" : "bg-green-600"
                      }`}
                    >
                      {user.status === "ACTIVE" ? "Off" : "On"}
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
