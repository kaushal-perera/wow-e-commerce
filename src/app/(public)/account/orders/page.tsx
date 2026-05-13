import StoreFooter from "@/components/storefront/StoreFooter";
import StoreNavbar from "@/components/storefront/StoreNavbar";
import CustomerOrdersClient from "@/components/storefront/CustomerOrdersClient";

export default function CustomerOrdersPage() {
  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <StoreNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <CustomerOrdersClient />
      </main>

      <StoreFooter />
    </div>
  );
}
