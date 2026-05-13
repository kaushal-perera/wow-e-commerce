"use client";

import { FormEvent, useState } from "react";
import { KeyRound } from "lucide-react";
import { resetStaffUserPassword, StaffUser } from "@/lib/api/usersApi";

type Props = {
  user: StaffUser;
};

export default function ResetPasswordCard({ user }: Props) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to reset password for ${user.fullName}?`,
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      await resetStaffUserPassword(user._id, password);
      setPassword("");
      setMessage("Password reset successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to reset password.",
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
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-900">
          <KeyRound size={22} />
        </div>

        <div>
          <h2 className="font-black text-red-950">Reset Password</h2>
          <p className="text-sm text-gray-500">
            Set a new password for this user.
          </p>
        </div>
      </div>

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

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          New Password
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 h-12 w-full rounded-2xl bg-red-950 text-sm font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
