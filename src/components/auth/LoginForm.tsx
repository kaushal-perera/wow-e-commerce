"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

type LoginUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result: ApiResponse<LoginUser> = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Login failed.");
        return;
      }

      if (result.data?.role === "CUSTOMER") {
        router.push("/account");
      } else {
        router.push("/admin");
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7f7]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE - BRAND SECTION */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-700 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-red-300/20 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative z-10 flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-900 shadow-xl">
              <ShoppingBag size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-wide">WOW</h2>
              <p className="text-sm text-red-100">E-Commerce System</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative z-10 max-w-xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Sparkles size={16} />
              Manage inventory and online orders smarter
            </div>

            <h1 className="text-5xl font-black leading-tight xl:text-6xl">
              Shop Better.
              <br />
              Manage Smarter.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-red-100 xl:text-lg">
              Login to manage products, customers, orders, stock levels, and
              deliveries through one modern WOW dashboard.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <ShieldCheck className="mb-3 text-red-100" size={28} />
                <h3 className="font-bold">Secure Login</h3>
                <p className="mt-1 text-sm text-red-100">
                  Role-based system access.
                </p>
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <ShoppingBag className="mb-3 text-red-100" size={28} />
                <h3 className="font-bold">Online Orders</h3>
                <p className="mt-1 text-sm text-red-100">
                  Customers can order easily.
                </p>
              </div>
            </div>
          </motion.div>

          <p className="relative z-10 text-sm text-red-100">
            © {new Date().getFullYear()} WOW. All rights reserved.
          </p>
        </section>

        {/* RIGHT SIDE - LOGIN FORM */}
        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-[440px]"
          >
            {/* MOBILE LOGO */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-950 text-white shadow-lg shadow-red-950/20">
                <ShoppingBag size={30} />
              </div>

              <h1 className="text-3xl font-black text-red-950">WOW</h1>
              <p className="mt-1 text-sm text-gray-500">
                Shop Better. Manage Smarter.
              </p>
            </div>

            <div className="rounded-[2rem] border border-red-100 bg-white/95 p-5 shadow-2xl shadow-red-950/10 backdrop-blur sm:p-7 md:p-8">
              <div className="mb-7">
                <h2 className="text-2xl font-black text-red-950 sm:text-3xl">
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Login to continue shopping or managing your WOW store.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <div className="flex h-12 items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 transition focus-within:border-red-700 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-red-950/5 sm:h-14">
                    <Mail size={18} className="shrink-0 text-red-800" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-full w-full bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
                      placeholder="customer@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-red-800 hover:text-red-950"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="flex h-12 items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 transition focus-within:border-red-700 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-red-950/5 sm:h-14">
                    <Lock size={18} className="shrink-0 text-red-800" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-full w-full bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="shrink-0 rounded-lg p-1 text-gray-500 transition hover:bg-red-100 hover:text-red-900"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-2xl bg-gradient-to-r from-red-700 to-red-950 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:from-red-800 hover:to-red-950 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:text-base"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </motion.button>
              </form>

              <div className="mt-7 border-t border-red-100 pt-6 text-center">
                <p className="text-sm text-gray-600">
                  Do not have an account?{" "}
                  <a
                    href="/register"
                    className="font-bold text-red-800 transition hover:text-red-950"
                  >
                    Register
                  </a>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              Secure access for customers, admins, inventory staff, sales staff,
              and delivery staff.
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
