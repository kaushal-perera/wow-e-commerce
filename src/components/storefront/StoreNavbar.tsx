"use client";

import Link from "next/link";
import {
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCartItems } from "@/lib/cart";
import { useRouter } from "next/navigation";

export default function StoreNavbar() {
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  function updateCartCount() {
    const count = getCartItems().reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    updateCartCount();

    window.addEventListener("wow-cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("wow-cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
    },
    {
      label: "My Orders",
      href: "/account/orders",
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-red-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-950 text-white shadow-lg shadow-red-900/20">
            <ShoppingBag size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">WOW</h1>
            <p className="hidden text-xs font-medium text-gray-500 sm:block">
              Shop Better
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-gray-600 transition hover:text-red-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden h-12 w-full max-w-sm items-center rounded-2xl border border-red-100 bg-red-50/50 px-4 lg:flex">
          <Search size={18} className="text-red-800" />
          <input
            type="text"
            placeholder="Search products..."
            className="h-full w-full bg-transparent px-3 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-xl border border-red-100 p-2.5 text-red-900 transition hover:bg-red-50"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className="hidden rounded-xl border border-red-100 p-2.5 text-red-900 transition hover:bg-red-50 sm:block"
            title="My Account"
          >
            <User size={21} />
          </Link>

          <button
            onClick={handleLogout}
            className="hidden rounded-xl bg-red-950 p-2.5 text-white transition hover:bg-red-800 sm:block"
            title="Logout"
          >
            <LogOut size={21} />
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="rounded-xl border border-red-100 p-2.5 text-red-900 lg:hidden"
          >
            <Menu size={21} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-red-950">WOW Menu</h2>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-red-100 p-2 text-red-900"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-900"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-900"
              >
                <User size={18} />
                My Account
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-900"
              >
                <ShoppingCart size={18} />
                Cart
              </Link>

              <button
                onClick={async () => {
                  setIsOpen(false);
                  await handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-2xl bg-red-950 px-4 py-3 text-left text-sm font-bold text-white hover:bg-red-800"
              >
                <LogOut size={18} />
                Logout
              </button>

              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block rounded-2xl border border-red-100 px-4 py-3 text-sm font-bold text-red-900 hover:bg-red-50"
              >
                Login / Register
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
