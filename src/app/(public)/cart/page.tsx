import StoreFooter from "@/components/storefront/StoreFooter";
import StoreNavbar from "@/components/storefront/StoreNavbar";
import CartClient from "@/components/storefront/CartClient";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <StoreNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <CartClient />
      </main>

      <StoreFooter />
    </div>
  );
}
