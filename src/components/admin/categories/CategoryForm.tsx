"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Category,
  CategoryPayload,
  createCategory,
  updateCategory,
} from "@/lib/api/categoriesApi";
import { Save } from "lucide-react";

type Props = {
  mode: "create" | "edit";
  category?: Category;
};

export default function CategoryForm({ mode, category }: Props) {
  const router = useRouter();

  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [image, setImage] = useState(category?.image || "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const payload: CategoryPayload = {
        name,
        description,
        image,
        isActive,
      };

      if (mode === "create") {
        await createCategory(payload);
      } else {
        if (!category?._id) {
          throw new Error("Category id is missing.");
        }

        await updateCategory(category._id, payload);
      }

      router.push("/admin/categories");
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

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: Electronics"
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a short category description..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm outline-none transition focus:border-red-700 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Image URL
          </label>

          <input
            type="text"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder="https://example.com/category-image.jpg"
            className="h-12 w-full rounded-2xl border border-red-100 bg-red-50/40 px-4 text-sm outline-none transition focus:border-red-700 focus:bg-white"
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/40 p-4">
          <div>
            <p className="text-sm font-bold text-red-950">Category Status</p>
            <p className="mt-1 text-xs text-gray-500">
              Inactive categories can be hidden from the customer website.
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

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
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
                ? "Create Category"
                : "Update Category"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
