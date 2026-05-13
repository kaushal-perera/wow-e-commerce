import StoreFooter from "@/components/storefront/StoreFooter";
import StoreNavbar from "@/components/storefront/StoreNavbar";
import ProductCard from "@/components/storefront/ProductCard";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import {
  ArrowRight,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Link from "next/link";

async function getHomeData() {
  await connectDB();

  const [featuredProducts, categories] = await Promise.all([
    Product.find({
      isActive: true,
      isFeatured: true,
    })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),

    Category.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  return {
    featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export default async function HomePage() {
  const { featuredProducts, categories } = await getHomeData();

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <StoreNavbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-700 text-white">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-red-300/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <ShoppingBag size={16} />
                Welcome to WOW Store
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl xl:text-6xl">
                Shop Better.
                <br />
                Feel the WOW.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-red-100 sm:text-base">
                Discover products, add them to your cart, checkout online, and
                track your orders easily through your WOW account.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-red-950 transition hover:bg-red-50"
                >
                  Shop Products
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/30 px-6 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Quality Products",
                  icon: Package,
                },
                {
                  title: "Secure Account",
                  icon: ShieldCheck,
                },
                {
                  title: "Fast Delivery",
                  icon: Truck,
                },
                {
                  title: "Easy Shopping",
                  icon: ShoppingBag,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur"
                  >
                    <Icon size={32} className="text-red-100" />
                    <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-red-100">
                      Simple, fast, and smooth shopping experience.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                Categories
              </p>
              <h2 className="mt-2 text-3xl font-black text-red-950">
                Shop by Category
              </h2>
            </div>

            <Link
              href="/products"
              className="font-bold text-red-800 hover:text-red-950"
            >
              View all products
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: any) => (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}`}
                className="group rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-900">
                  <Package size={26} />
                </div>

                <h3 className="mt-5 text-xl font-black text-red-950">
                  {category.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {category.description || "Explore products in this category."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-black text-red-950">
                Featured Products
              </h2>
            </div>

            <Link
              href="/products"
              className="font-bold text-red-800 hover:text-red-950"
            >
              Browse more
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="rounded-[1.5rem] bg-white p-10 text-center text-gray-500">
              No featured products yet. Mark products as featured from admin.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
