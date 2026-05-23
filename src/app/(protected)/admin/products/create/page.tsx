import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import ProductForm from "@/components/admin/products/ProductForm";
import { Category } from "@/lib/api/categoriesApi";
import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/models/Category";

async function getCategories(): Promise<Category[]> {
  await connectDB();

  const categories = await CategoryModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(categories));
}

export default async function CreateProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">Create Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new product to the WOW shop.
            </p>
          </div>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 transition hover:bg-red-50"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </section>

      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
