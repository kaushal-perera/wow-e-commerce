"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { deleteProduct, getProducts, Product } from "@/lib/api/productsApi";
import { Edit, Eye, Package, Plus, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadProducts() {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load products.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();

      return (
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search) ||
        product.categoryId?.name?.toLowerCase().includes(search)
      );
    });
  }, [products, searchTerm]);

  function getStockBadge(product: Product) {
    if (product.stockQuantity === 0) {
      return "Out of Stock";
    }

    if (product.stockQuantity <= product.reorderLevel) {
      return "Low Stock";
    }

    return "In Stock";
  }

  function getStockBadgeClass(product: Product) {
    if (product.stockQuantity === 0) {
      return "bg-red-50 text-red-700";
    }

    if (product.stockQuantity <= product.reorderLevel) {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-green-50 text-green-700";
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Product Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create, view, update, and manage shop products.
            </p>
          </div>
        </div>

        <Link
          href="/admin/products/create"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-5 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:from-red-800 hover:to-red-950"
        >
          <Plus size={18} />
          Add Product
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
              placeholder="Search products by name, SKU, or category..."
              className="h-full w-full bg-transparent px-3 text-sm outline-none"
            />
          </div>

          <p className="text-sm font-semibold text-gray-500">
            Total: {filteredProducts.length}
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
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-red-50 text-center">
            <Package size={42} className="text-red-900" />
            <h2 className="mt-3 text-lg font-black text-red-950">
              No products found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create your first product.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-red-100 text-sm text-gray-500">
                    <th className="px-4 py-4 font-bold">Product</th>
                    <th className="px-4 py-4 font-bold">Category</th>
                    <th className="px-4 py-4 font-bold">Price</th>
                    <th className="px-4 py-4 font-bold">Stock</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-red-50 text-sm transition hover:bg-red-50/60"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-red-100 text-red-900">
                            {product.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package size={22} />
                            )}
                          </div>

                          <div>
                            <div className="font-bold text-red-950">
                              {product.name}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              SKU: {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {product.categoryId?.name || "No category"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-red-950">
                          {product.discountPrice
                            ? `Rs. ${product.discountPrice}`
                            : `Rs. ${product.price}`}
                        </div>

                        {product.discountPrice ? (
                          <div className="text-xs text-gray-400 line-through">
                            Rs. {product.price}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStockBadgeClass(
                            product,
                          )}`}
                        >
                          {getStockBadge(product)}
                        </span>

                        <div className="mt-1 text-xs text-gray-500">
                          Qty: {product.stockQuantity}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            product.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="rounded-xl border border-red-100 p-2 text-red-900 transition hover:bg-red-100"
                            title="View"
                          >
                            <Eye size={17} />
                          </Link>

                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="rounded-xl border border-red-100 p-2 text-red-900 transition hover:bg-red-100"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </Link>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="rounded-xl border border-red-100 p-2 text-red-700 transition hover:bg-red-100"
                            title="Delete"
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

            <div className="space-y-3 lg:hidden">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-2xl border border-red-100 bg-red-50/50 p-4"
                >
                  <div className="flex gap-3">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-red-100 text-red-900">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-black text-red-950">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        SKU: {product.sku}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.categoryId?.name || "No category"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStockBadgeClass(
                            product,
                          )}`}
                        >
                          {getStockBadge(product)}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            product.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-900"
                    >
                      <Eye size={16} />
                      View
                    </Link>

                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-900"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-900 px-3 py-2 text-sm font-bold text-white"
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
