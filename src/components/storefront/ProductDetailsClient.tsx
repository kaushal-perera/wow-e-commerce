"use client";

import { Product } from "@/lib/api/productsApi";
import { addProductToCart, getSellingPrice } from "@/lib/cart";
import { motion } from "framer-motion";
import { Minus, Package, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

type Props = {
  product: Product;
};

export default function ProductDetailsClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || "");
  const [message, setMessage] = useState("");

  const sellingPrice = getSellingPrice(product);
  const hasDiscount = product.discountPrice && product.discountPrice > 0;

  function handleAddToCart() {
    if (product.stockQuantity <= 0) return;

    addProductToCart(product, quantity);
    setMessage("Product added to cart");

    setTimeout(() => {
      setMessage("");
    }, 1500);
  }

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-xl shadow-red-950/5">
          {selectedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={90} className="text-red-900" />
          )}
        </div>

        {product.images?.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {product.images.map((image) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`aspect-square overflow-hidden rounded-2xl border ${
                  selectedImage === image ? "border-red-800" : "border-red-100"
                } bg-white`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[2rem] border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
          {product.categoryId?.name || "Product"}
        </p>

        <h1 className="mt-3 text-3xl font-black text-red-950 sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
              <Star size={14} />
              Featured
            </span>
          )}

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              product.stockQuantity > 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-3xl font-black text-red-950">Rs. {sellingPrice}</p>

          {hasDiscount && (
            <p className="mt-1 text-sm text-gray-400 line-through">
              Rs. {product.price}
            </p>
          )}
        </div>

        <p className="mt-6 whitespace-pre-line text-sm leading-7 text-gray-600">
          {product.description || "No description available for this product."}
        </p>

        <div className="mt-6 rounded-2xl bg-red-50 p-4">
          <p className="text-sm font-bold text-red-950">Product Information</p>

          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <p className="text-gray-500">
              SKU: <span className="font-bold text-red-950">{product.sku}</span>
            </p>
            <p className="text-gray-500">
              Stock:{" "}
              <span className="font-bold text-red-950">
                {product.stockQuantity}
              </span>
            </p>
            <p className="text-gray-500">
              Brand:{" "}
              <span className="font-bold text-red-950">
                {product.brand || "N/A"}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex h-12 w-full items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 px-3 sm:w-40">
            <button
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="rounded-xl p-2 text-red-900 hover:bg-red-100"
            >
              <Minus size={16} />
            </button>

            <span className="font-black text-red-950">{quantity}</span>

            <button
              onClick={() =>
                setQuantity((current) =>
                  Math.min(product.stockQuantity, current + 1),
                )
              }
              className="rounded-xl p-2 text-red-900 hover:bg-red-100"
            >
              <Plus size={16} />
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-6 text-sm font-black text-white shadow-lg shadow-red-900/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </motion.button>
        </div>

        {message && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
