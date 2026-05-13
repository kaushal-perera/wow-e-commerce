"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShoppingBag,
  Sparkles,
  User,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

type ApiResponse = {
  success: boolean;
  message: string;
};

export default function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Registration failed.");
        return;
      }

      setMessage("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff7f7] lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen grid-cols-1 lg:h-screen lg:min-h-0 lg:grid-cols-2">
        {/* LEFT BRAND SECTION */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-700 px-10 py-10 text-white lg:flex lg:h-screen lg:flex-col lg:justify-between">
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
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Sparkles size={16} />
              Start shopping smarter with WOW
            </div>

            <h1 className="text-4xl font-black leading-tight xl:text-5xl">
              Create Your
              <br />
              WOW Account.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-red-100 xl:text-base">
              Register as a customer and enjoy a smooth online shopping
              experience with easy ordering and order tracking.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <UserPlus className="mb-3 text-red-100" size={26} />
                <h3 className="font-bold">Easy Signup</h3>
                <p className="mt-1 text-sm text-red-100">
                  Create your customer account quickly.
                </p>
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <ShieldCheck className="mb-3 text-red-100" size={26} />
                <h3 className="font-bold">Secure Access</h3>
                <p className="mt-1 text-sm text-red-100">
                  Protected account and order history.
                </p>
              </div>
            </div>
          </motion.div>

          <p className="relative z-10 text-sm text-red-100">
            © {new Date().getFullYear()} WOW. All rights reserved.
          </p>
        </section>

        {/* RIGHT REGISTER FORM */}
        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 md:px-10 lg:h-screen lg:min-h-0 lg:px-10 lg:py-4">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-[460px]"
          >
            {/* MOBILE LOGO */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-950 text-white shadow-lg shadow-red-950/20">
                <ShoppingBag size={30} />
              </div>

              <h1 className="text-3xl font-black text-red-950">WOW</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create your account and start shopping.
              </p>
            </div>

            <div className="rounded-[2rem] border border-red-100 bg-white/95 p-5 shadow-2xl shadow-red-950/10 backdrop-blur sm:p-7 lg:p-6 xl:p-7">
              <div className="mb-5 lg:mb-4">
                <h2 className="text-2xl font-black text-red-950 sm:text-3xl lg:text-2xl xl:text-3xl">
                  Create Account
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500 lg:text-xs xl:text-sm">
                  Join WOW and start ordering your favorite products online.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                >
                  {message}
                </motion.div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-3 lg:space-y-3 xl:space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <div className="flex h-12 items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 transition focus-within:border-red-700 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-red-950/5 lg:h-11 xl:h-12">
                    <User size={18} className="shrink-0 text-red-800" />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="h-full w-full bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <div className="flex h-12 items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 transition focus-within:border-red-700 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-red-950/5 lg:h-11 xl:h-12">
                    <Mail size={18} className="shrink-0 text-red-800" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-full w-full bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                      placeholder="customer@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <div className="flex h-12 items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 transition focus-within:border-red-700 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-red-950/5 lg:h-11 xl:h-12">
                    <Phone size={18} className="shrink-0 text-red-800" />

                    <input
                      type="text"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="h-full w-full bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Password
                    </label>

                    <div className="flex h-12 items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 transition focus-within:border-red-700 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-red-950/5 lg:h-11 xl:h-12">
                      <Lock size={18} className="shrink-0 text-red-800" />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-full w-full min-w-0 bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                        placeholder="Password"
                        autoComplete="new-password"
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
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Confirm
                    </label>

                    <div className="flex h-12 items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 transition focus-within:border-red-700 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-red-950/5 lg:h-11 xl:h-12">
                      <Lock size={18} className="shrink-0 text-red-800" />

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        className="h-full w-full min-w-0 bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                        placeholder="Confirm"
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        className="shrink-0 rounded-lg p-1 text-gray-500 transition hover:bg-red-100 hover:text-red-900"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-5 text-gray-500 lg:hidden xl:block">
                  Password must be at least 6 characters.
                </p>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-2xl bg-gradient-to-r from-red-700 to-red-950 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:from-red-800 hover:to-red-950 disabled:cursor-not-allowed disabled:opacity-70 lg:h-11 xl:h-12"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </motion.button>
              </form>

              <div className="mt-5 border-t border-red-100 pt-4 text-center lg:mt-4 lg:pt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-bold text-red-800 transition hover:text-red-950"
                  >
                    Login
                  </a>
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400 lg:mt-3">
              By creating an account, you can place orders and view your order
              history.
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
