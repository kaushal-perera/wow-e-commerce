import Link from "next/link";
import { ArrowLeft, Layers3 } from "lucide-react";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { Category } from "@/lib/api/categoriesApi";

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

async function getCategory(id: string): Promise<Category> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(`${appUrl}/api/categories/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<Category> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch category.");
  }

  return result.data;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getCategory(id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Layers3 size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">Edit Category</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update category information.
            </p>
          </div>
        </div>

        <Link
          href="/admin/categories"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 transition hover:bg-red-50"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </section>

      <CategoryForm mode="edit" category={category} />
    </div>
  );
}
