"use client";

import { clearCart, getCartItems, CartItem } from "@/lib/cart";
import { createOrder, PaymentMethod } from "@/lib/api/ordersApi";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutClient() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = 350;
  const discount = 0;

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalAmount = subtotal + deliveryFee - discount;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        deliveryFee,
        discount,
        paymentMethod,
        deliveryAddress: {
          fullName,
          phone,
          line1,
          line2,
          city,
          postalCode,
        },
        notes,
      });

      clearCart();
      router.push(`/account/orders/${order._id}`);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place order.";

      if (message.toLowerCase().includes("unauthorized")) {
        setError("Please login as a customer before placing an order.");
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-red-950/5">
        <ShoppingCart size={58} className="text-red-900" />
        <h1 className="mt-5 text-3xl font-black text-red-950">
          Nothing to checkout
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Add products to your cart first.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-red-900 px-6 text-sm font-black text-white hover:bg-red-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[1fr_360px]"
    >
      <section className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-xl shadow-red-950/5 sm:p-6">
        <h1 className="text-3xl font-black text-red-950">Checkout</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter delivery details and place your order.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Phone
            </label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Address Line 1
            </label>
            <input
              value={line1}
              onChange={(event) => setLine1(event.target.value)}
              required
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Address Line 2
            </label>
            <input
              value={line2}
              onChange={(event) => setLine2(event.target.value)}
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              City
            </label>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Postal Code
            </label>
            <input
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(event.target.value as PaymentMethod)
              }
              className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none focus:border-red-700 focus:bg-white"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full resize-none rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm outline-none focus:border-red-700 focus:bg-white"
            />
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-[2rem] border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
        <h2 className="text-xl font-black text-red-950">Order Summary</h2>

        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="text-gray-500">
                {item.name} × {item.quantity}
              </span>
              <span className="font-bold text-red-950">
                Rs. {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3 border-t border-red-100 pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold text-red-950">Rs. {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Fee</span>
            <span className="font-bold text-red-950">Rs. {deliveryFee}</span>
          </div>

          <div className="flex justify-between text-lg">
            <span className="font-black text-red-950">Total</span>
            <span className="font-black text-red-950">Rs. {totalAmount}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 h-12 w-full rounded-2xl bg-gradient-to-r from-red-700 to-red-950 text-sm font-black text-white shadow-lg shadow-red-900/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          You must be logged in as a customer.
        </p>
      </aside>
    </form>
  );
}
