"use client";

import {
  CartItem,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart";
import { Minus, Package, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  function loadCart() {
    setItems(getCartItems());
  }

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  function handleQuantityChange(productId: string, quantity: number) {
    updateCartItemQuantity(productId, quantity);
    loadCart();
  }

  function handleRemove(productId: string) {
    removeCartItem(productId);
    loadCart();
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-red-950/5">
        <ShoppingCart size={58} className="text-red-900" />
        <h1 className="mt-5 text-3xl font-black text-red-950">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Add products to your cart and come back here.
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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-xl shadow-red-950/5 sm:p-6">
        <h1 className="text-3xl font-black text-red-950">Shopping Cart</h1>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col gap-4 rounded-2xl bg-red-50 p-4 sm:flex-row sm:items-center"
            >
              <Link
                href={`/products/${item.slug}`}
                className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-red-900"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package size={28} />
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.slug}`}>
                  <h2 className="font-black text-red-950 hover:text-red-700">
                    {item.name}
                  </h2>
                </Link>

                <p className="mt-1 text-xs text-gray-500">SKU: {item.sku}</p>
                <p className="mt-2 font-black text-red-950">Rs. {item.price}</p>
              </div>

              <div className="flex h-11 w-full items-center justify-between rounded-2xl bg-white px-3 sm:w-36">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity - 1)
                  }
                  className="rounded-xl p-2 text-red-900 hover:bg-red-50"
                >
                  <Minus size={15} />
                </button>

                <span className="font-black text-red-950">{item.quantity}</span>

                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity + 1)
                  }
                  className="rounded-xl p-2 text-red-900 hover:bg-red-50"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={() => handleRemove(item.productId)}
                className="flex h-11 items-center justify-center rounded-2xl bg-red-900 px-4 text-white hover:bg-red-800"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-[2rem] border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
        <h2 className="text-xl font-black text-red-950">Order Summary</h2>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-black text-red-950">Rs. {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Fee</span>
            <span className="font-black text-red-950">
              Calculated at checkout
            </span>
          </div>

          <div className="border-t border-red-100 pt-4">
            <div className="flex justify-between text-lg">
              <span className="font-black text-red-950">Total</span>
              <span className="font-black text-red-950">Rs. {subtotal}</span>
            </div>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-950 text-sm font-black text-white shadow-lg shadow-red-900/20"
        >
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}
