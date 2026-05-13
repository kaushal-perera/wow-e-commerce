"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import {
  createStaffUser,
  StaffRole,
  StaffUser,
  updateStaffUser,
  UserStatus,
} from "@/lib/api/usersApi";

type Props = {
  mode: "create" | "edit";
  user?: StaffUser;
};

const roles: StaffRole[] = [
  "ADMIN",
  "INVENTORY_MANAGER",
  "SALES_STAFF",
  "DELIVERY_STAFF",
];

export default function StaffUserForm({ mode, user }: Props) {
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>(user?.role || "SALES_STAFF");
  const [status, setStatus] = useState<UserStatus>(user?.status || "ACTIVE");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }

        await createStaffUser({
          fullName,
          email,
          phone,
          password,
          role,
          status,
        });
      } else {
        if (!user?._id) {
          throw new Error("User id is missing.");
        }

        await updateStaffUser(user._id, {
          fullName,
          phone,
          role,
          status,
        });
      }

      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
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

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            placeholder="Staff full name"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white disabled:cursor-not-allowed disabled:bg-gray-100"
            placeholder="staff@wow.com"
            disabled={mode === "edit"}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Phone Number
          </label>

          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            placeholder="Phone number"
          />
        </div>

        {mode === "create" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
              placeholder="Minimum 6 characters"
              required
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Role
          </label>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value as StaffRole)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
          >
            {roles.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Status
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as UserStatus)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
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
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Staff User"
                : "Update Staff User"}
          </button>
        </div>
      </div>
    </form>
  );
}
