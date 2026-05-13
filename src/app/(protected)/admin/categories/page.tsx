"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Category,
  deleteCategory,
  getCategories,
} from "@/lib/api/categoriesApi";
import { Edit, Layers3, Plus, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadCategories() {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load categories.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete.");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
              <Layers3 size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-red-950">
                Category Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create and manage product categories.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/categories/create"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-5 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:from-red-800 hover:to-red-950"
        >
          <Plus size={18} />
          Add Category
        </Link>
      </section>

      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-12 w-full items-center rounded-2xl border border-red-100 bg-red-50/40 px-4 sm:max-w-md">
            <Search size={18} className="text-red-800" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search categories..."
              className="h-full w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <p className="text-sm font-semibold text-gray-500">
            Total: {filteredCategories.length}
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-2xl bg-red-50"
              />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
            <Layers3 size={42} className="text-red-900" />
            <h2 className="mt-3 text-lg font-black text-red-950">
              No categories found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create your first product category.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-red-100 text-sm text-gray-500">
                    <th className="px-4 py-4 font-bold">Name</th>
                    <th className="px-4 py-4 font-bold">Slug</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold">Created</th>
                    <th className="px-4 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-red-50 text-sm transition hover:bg-red-50/60"
                    >
                      <td className="px-4 py-4">
                        <div className="font-bold text-red-950">
                          {category.name}
                        </div>
                        <div className="mt-1 max-w-sm truncate text-xs text-gray-500">
                          {category.description || "No description"}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {category.slug}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            category.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/categories/${category._id}/edit`}
                            className="rounded-xl border border-red-100 p-2 text-red-900 transition hover:bg-red-100"
                          >
                            <Edit size={17} />
                          </Link>

                          <button
                            onClick={() => handleDelete(category._id)}
                            className="rounded-xl border border-red-100 p-2 text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-2xl border border-red-100 bg-red-50/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-red-950">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {category.slug}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        category.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                    {category.description || "No description"}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/admin/categories/${category._id}/edit`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-900"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(category._id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-900 px-3 py-2 text-sm font-bold text-white"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
