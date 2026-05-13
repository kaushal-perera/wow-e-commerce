import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Package,
  Layers3,
  Tag,
  Boxes,
  AlertTriangle,
  Star,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Product } from "@/lib/api/productsApi";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

async function getProduct(id: string): Promise<Product> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(`${appUrl}/api/products/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<Product> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch product.");
  }

  return result.data;
}

function getStockStatus(product: Product) {
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

export default async function ViewProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  const stockStatus = getStockStatus(product);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Product Details
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View complete product information.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/products"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 transition hover:bg-red-50"
          >
            <ArrowLeft size={17} />
            Back
          </Link>

          <Link
            href={`/admin/products/${product._id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-4 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:from-red-800 hover:to-red-950"
          >
            <Edit size={17} />
            Edit Product
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 lg:col-span-1">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] bg-red-50">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package size={70} className="text-red-900" />
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="aspect-square overflow-hidden rounded-2xl bg-red-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-3xl font-black text-red-950">
                  {product.name}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  SKU: <span className="font-bold">{product.sku}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    product.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>

                {product.isFeatured && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                    Featured
                  </span>
                )}

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${stockStatus.className}`}
                >
                  {stockStatus.label}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-red-50 p-4">
                <Tag className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Price
                </p>
                <h3 className="mt-1 text-xl font-black text-red-950">
                  Rs. {product.price}
                </h3>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <Tag className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Discount Price
                </p>
                <h3 className="mt-1 text-xl font-black text-red-950">
                  Rs. {product.discountPrice || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <Boxes className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Stock Quantity
                </p>
                <h3 className="mt-1 text-xl font-black text-red-950">
                  {product.stockQuantity}
                </h3>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <AlertTriangle className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Reorder Level
                </p>
                <h3 className="mt-1 text-xl font-black text-red-950">
                  {product.reorderLevel}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
              <h3 className="text-lg font-black text-red-950">
                Product Information
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4">
                  <Layers3 size={20} className="mt-0.5 text-red-900" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Category
                    </p>
                    <p className="mt-1 font-bold text-red-950">
                      {product.categoryId?.name || "No category"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4">
                  <Package size={20} className="mt-0.5 text-red-900" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Brand</p>
                    <p className="mt-1 font-bold text-red-950">
                      {product.brand || "No brand"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4">
                  <Star size={20} className="mt-0.5 text-red-900" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Featured
                    </p>
                    <p className="mt-1 font-bold text-red-950">
                      {product.isFeatured ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
              <h3 className="text-lg font-black text-red-950">Status</h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-red-50 p-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Product Status
                    </p>
                    <p className="mt-1 font-bold text-red-950">
                      {product.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>

                  {product.isActive ? (
                    <CheckCircle2 className="text-green-600" size={26} />
                  ) : (
                    <XCircle className="text-gray-500" size={26} />
                  )}
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Created Date
                  </p>
                  <p className="mt-1 font-bold text-red-950">
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Last Updated
                  </p>
                  <p className="mt-1 font-bold text-red-950">
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <h3 className="text-lg font-black text-red-950">Description</h3>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
              {product.description || "No product description added."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
