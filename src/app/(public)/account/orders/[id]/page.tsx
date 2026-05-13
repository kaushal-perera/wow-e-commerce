import StoreFooter from "@/components/storefront/StoreFooter";
import StoreNavbar from "@/components/storefront/StoreNavbar";
import CustomerOrderDetailsClient from "@/components/storefront/CustomerOrderDetailsClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <StoreNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <CustomerOrderDetailsClient orderId={id} />
      </main>

      <StoreFooter />
    </div>
  );
}
