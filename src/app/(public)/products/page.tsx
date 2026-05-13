import StoreFooter from "@/components/storefront/StoreFooter";
import StoreNavbar from "@/components/storefront/StoreNavbar";
import ProductCard from "@/components/storefront/ProductCard";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { Package } from "lucide-react";

type PageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
};

async function getProducts(category?: string, q?: string) {
  await connectDB();

  const categoryDoc = category
    ? await Category.findOne({
        slug: category,
      }).lean()
    : null;

  const filter: any = {
    isActive: true,
  };

  if (categoryDoc) {
    filter.categoryId = categoryDoc._id;
  }

  if (q) {
    filter.name = {
      $regex: q,
      $options: "i",
    };
  }

  const [products, categories] = await Promise.all([
    Product.find(filter)
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean(),

    Category.find({
      isActive: true,
    })
      .sort({ name: 1 })
      .lean(),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { products, categories } = await getProducts(params.category, params.q);

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <StoreNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-red-950 via-red-900 to-red-700 p-8 text-white shadow-xl shadow-red-950/20">
          <h1 className="text-3xl font-black sm:text-4xl">Shop Products</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-red-100">
            Browse all available WOW products and add your favorites to cart.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5">
            <h2 className="font-black text-red-950">Categories</h2>

            <div className="mt-4 space-y-2">
              <a
                href="/products"
                className="block rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-900"
              >
                All Products
              </a>

              {categories.map((category: any) => (
                <a
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-900"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </aside>

          <div>
            {products.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-[1.5rem] bg-white text-center shadow-lg shadow-red-950/5">
                <Package size={48} className="text-red-900" />
                <h2 className="mt-4 text-xl font-black text-red-950">
                  No products found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Try another category or add products from admin.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
