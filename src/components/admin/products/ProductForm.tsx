"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import {
  Product,
  ProductPayload,
  createProduct,
  updateProduct,
} from "@/lib/api/productsApi";
import { Category } from "@/lib/api/categoriesApi";

type Props = {
  mode: "create" | "edit";
  product?: Product;
  categories: Category[];
};

export default function ProductForm({ mode, product, categories }: Props) {
  const router = useRouter();

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId?._id || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [discountPrice, setDiscountPrice] = useState(
    product?.discountPrice || 0,
  );
  const [sku, setSku] = useState(product?.sku || "");
  const [stockQuantity, setStockQuantity] = useState(
    product?.stockQuantity || 0,
  );
  const [reorderLevel, setReorderLevel] = useState(product?.reorderLevel || 5);
  const [brand, setBrand] = useState(product?.brand || "");
  const [imageText, setImageText] = useState(product?.images?.join("\n") || "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const images = imageText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload: ProductPayload = {
        name,
        description,
        categoryId,
        price,
        discountPrice,
        sku,
        stockQuantity,
        reorderLevel,
        images,
        brand,
        isFeatured,
        isActive,
      };

      if (mode === "create") {
        await createProduct(payload);
      } else {
        if (!product?._id) {
          throw new Error("Product id is missing.");
        }

        await updateProduct(product._id, payload);
      }

      router.push("/admin/products");
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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
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
            Product Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: Wireless Headphones"
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            SKU
          </label>

          <input
            type="text"
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            placeholder="Example: WOW-1001"
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm uppercase outline-none transition focus:border-red-700 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
            required
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Brand
          </label>

          <input
            type="text"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            placeholder="Example: Apple, Samsung, Nike"
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            min={0}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Discount Price
          </label>

          <input
            type="number"
            value={discountPrice}
            onChange={(event) => setDiscountPrice(Number(event.target.value))}
            min={0}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Stock Quantity
          </label>

          <input
            type="number"
            value={stockQuantity}
            onChange={(event) => setStockQuantity(Number(event.target.value))}
            min={0}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Reorder Level
          </label>

          <input
            type="number"
            value={reorderLevel}
            onChange={(event) => setReorderLevel(Number(event.target.value))}
            min={0}
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            placeholder="Write product description..."
            className="w-full resize-none rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm outline-none transition focus:border-red-700 focus:bg-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Product Image URLs
          </label>

          <textarea
            value={imageText}
            onChange={(event) => setImageText(event.target.value)}
            rows={4}
            placeholder={`Add one image URL per line\nhttps://example.com/image-1.jpg\nhttps://example.com/image-2.jpg`}
            className="w-full resize-none rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm outline-none transition focus:border-red-700 focus:bg-white"
          />
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-red-950">Featured Product</p>
              <p className="mt-1 text-xs text-gray-500">
                Show this product in featured sections.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFeatured((current) => !current)}
              className={`relative h-7 w-14 rounded-full transition ${
                isFeatured ? "bg-red-800" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  isFeatured ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-red-950">Product Status</p>
              <p className="mt-1 text-xs text-gray-500">
                Inactive products are hidden from customers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsActive((current) => !current)}
              className={`relative h-7 w-14 rounded-full transition ${
                isActive ? "bg-red-800" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  isActive ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="h-12 rounded-2xl border border-red-100 px-6 text-sm font-bold text-red-900 transition hover:bg-red-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-6 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:from-red-800 hover:to-red-950 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save size={18} />
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Product"
                : "Update Product"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
