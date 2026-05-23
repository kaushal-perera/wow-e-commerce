import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import ProductForm from "@/components/admin/products/ProductForm";
import { Product } from "@/lib/api/productsApi";
import { Category } from "@/lib/api/categoriesApi";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getProduct(id: string): Promise<Product> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  const product = await ProductModel.findById(id)
    .populate("categoryId", "name slug")
    .lean();

  if (!product) {
    notFound();
  }

  return JSON.parse(JSON.stringify(product));
}

async function getCategories(): Promise<Category[]> {
  await connectDB();

  const categories = await CategoryModel.find()
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(categories));
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">Edit Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update product information.
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

      <ProductForm mode="edit" product={product} categories={categories} />
    </div>
  );
}
