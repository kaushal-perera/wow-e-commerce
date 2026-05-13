import StoreFooter from "@/components/storefront/StoreFooter";
import StoreNavbar from "@/components/storefront/StoreNavbar";
import ProductCard from "@/components/storefront/ProductCard";
import ProductDetailsClient from "@/components/storefront/ProductDetailsClient";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProduct(slug: string) {
  await connectDB();

  const product = await Product.findOne({
    slug,
    isActive: true,
  }).populate("categoryId", "name slug");

  if (!product) {
    notFound();
  }

  const relatedProducts = await Product.find({
    _id: {
      $ne: product._id,
    },
    categoryId: product.categoryId,
    isActive: true,
  })
    .populate("categoryId", "name slug")
    .limit(4)
    .lean();

  return {
    product: JSON.parse(JSON.stringify(product)),
    relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const { product, relatedProducts } = await getProduct(slug);

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <StoreNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductDetailsClient product={product} />

        {relatedProducts.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-black text-red-950">
              Related Products
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item: any) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
