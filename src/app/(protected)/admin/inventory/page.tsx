"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Boxes, Eye, Package, Search } from "lucide-react";
import { Product } from "@/lib/api/productsApi";
import { getInventoryProducts } from "@/lib/api/inventoryApi";
import StockUpdateModal from "@/components/admin/inventory/StockUpdateModal";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "LOW_STOCK" | "OUT_OF_STOCK">(
    "ALL",
  );

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadInventory() {
    try {
      setIsLoading(true);
      const data = await getInventoryProducts();
      setProducts(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load inventory.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search) ||
        product.categoryId?.name?.toLowerCase().includes(search);

      const isLowStock =
        product.stockQuantity > 0 &&
        product.stockQuantity <= product.reorderLevel;

      const isOutOfStock = product.stockQuantity === 0;

      if (filter === "LOW_STOCK") {
        return matchesSearch && isLowStock;
      }

      if (filter === "OUT_OF_STOCK") {
        return matchesSearch && isOutOfStock;
      }

      return matchesSearch;
    });
  }, [products, searchTerm, filter]);

  const totalProducts = products.length;
  const lowStockCount = products.filter(
    (product) =>
      product.stockQuantity > 0 &&
      product.stockQuantity <= product.reorderLevel,
  ).length;
  const outOfStockCount = products.filter(
    (product) => product.stockQuantity === 0,
  ).length;

  function getStockBadge(product: Product) {
    if (product.stockQuantity === 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-50 text-red-700",
      };
    }

    if (product.stockQuantity <= product.reorderLevel) {
      return {
        label: "Low Stock",
        className: "bg-yellow-50 text-yellow-700",
      };
    }

    return {
      label: "In Stock",
      className: "bg-green-50 text-green-700",
    };
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
              <Boxes size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-red-950">
                Inventory Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage stock levels and product availability.
              </p>
            </div>
          </div>

          <Link
            href="/admin/inventory/movements"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-red-100 px-5 text-sm font-bold text-red-900 hover:bg-red-50"
          >
            View Stock Movements
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => setFilter("ALL")}
          className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
            filter === "ALL"
              ? "border-red-700 bg-red-900 text-white"
              : "border-red-100 bg-white text-red-950 hover:bg-red-50"
          }`}
        >
          <Package size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">
            Total Products
          </p>
          <h2 className="mt-1 text-3xl font-black">{totalProducts}</h2>
        </button>

        <button
          onClick={() => setFilter("LOW_STOCK")}
          className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
            filter === "LOW_STOCK"
              ? "border-yellow-600 bg-yellow-500 text-white"
              : "border-red-100 bg-white text-red-950 hover:bg-red-50"
          }`}
        >
          <AlertTriangle size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">Low Stock</p>
          <h2 className="mt-1 text-3xl font-black">{lowStockCount}</h2>
        </button>

        <button
          onClick={() => setFilter("OUT_OF_STOCK")}
          className={`rounded-[1.5rem] border p-5 text-left shadow-lg shadow-red-950/5 transition ${
            filter === "OUT_OF_STOCK"
              ? "border-red-700 bg-red-700 text-white"
              : "border-red-100 bg-white text-red-950 hover:bg-red-50"
          }`}
        >
          <Boxes size={24} />
          <p className="mt-3 text-sm font-semibold opacity-80">Out of Stock</p>
          <h2 className="mt-1 text-3xl font-black">{outOfStockCount}</h2>
        </button>
      </section>

      <section className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:p-6">
        <div className="mb-5 flex h-12 w-full items-center rounded-2xl border border-red-100 bg-red-50/40 px-4 sm:max-w-md">
          <Search size={18} className="text-red-800" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by product, SKU, or category..."
            className="h-full w-full bg-transparent px-3 text-sm outline-none"
          />
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
            <Boxes size={42} className="text-red-900" />
            <h2 className="mt-3 text-lg font-black text-red-950">
              No inventory found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Products will appear here after you create them.
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
                    <th className="px-4 py-4 font-bold">Stock</th>
                    <th className="px-4 py-4 font-bold">Reorder Level</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const badge = getStockBadge(product);

                    return (
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
                              <p className="font-bold text-red-950">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                SKU: {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {product.categoryId?.name || "No category"}
                        </td>

                        <td className="px-4 py-4 font-black text-red-950">
                          {product.stockQuantity}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {product.reorderLevel}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/products/${product._id}`}
                              className="rounded-xl border border-red-100 p-2 text-red-900 hover:bg-red-100"
                            >
                              <Eye size={17} />
                            </Link>

                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="rounded-xl bg-red-900 px-4 py-2 text-xs font-bold text-white hover:bg-red-800"
                            >
                              Update Stock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 lg:hidden">
              {filteredProducts.map((product) => {
                const badge = getStockBadge(product);

                return (
                  <div
                    key={product._id}
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
                          Stock:{" "}
                          <span className="font-bold">
                            {product.stockQuantity}
                          </span>
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-900"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="rounded-xl bg-red-900 px-3 py-2 text-sm font-bold text-white"
                      >
                        Update Stock
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdated={loadInventory}
        />
      )}
    </div>
  );
}
