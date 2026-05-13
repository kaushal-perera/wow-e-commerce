"use client";

import { Product } from "@/lib/api/productsApi";
import { addProductToCart, getSellingPrice } from "@/lib/cart";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [message, setMessage] = useState("");

  const sellingPrice = getSellingPrice(product);
  const hasDiscount = product.discountPrice && product.discountPrice > 0;

  function handleAddToCart() {
    if (product.stockQuantity <= 0) return;

    addProductToCart(product, 1);
    setMessage("Added");

    setTimeout(() => {
      setMessage("");
    }, 1000);
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group overflow-hidden rounded-[1.5rem] border border-red-100 bg-white shadow-lg shadow-red-950/5 transition hover:shadow-xl"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative flex aspect-square items-center justify-center overflow-hidden bg-red-50"
      >
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <Package size={56} className="text-red-900" />
        )}

        {product.isFeatured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-900 px-3 py-1 text-xs font-bold text-white">
            <Star size={13} />
            Featured
          </span>
        )}

        {product.stockQuantity <= 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
          {product.categoryId?.name || "Product"}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-12 font-black text-red-950 transition hover:text-red-700">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-black text-red-950">
              Rs. {sellingPrice}
            </p>

            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">
                Rs. {product.price}
              </p>
            )}
          </div>

          <p className="text-xs font-semibold text-gray-500">
            Stock: {product.stockQuantity}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity <= 0}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:from-red-800 hover:to-red-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={17} />
          {message ||
            (product.stockQuantity <= 0 ? "Out of Stock" : "Add to Cart")}
        </button>
      </div>
    </motion.div>
  );
}
