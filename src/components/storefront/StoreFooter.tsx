import { Mail, MapPin, Phone, ShoppingBag } from "lucide-react";

export default function StoreFooter() {
  return (
    <footer className="border-t border-red-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-950 text-white">
              <ShoppingBag size={25} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-red-950">WOW</h2>
              <p className="text-sm text-gray-500">
                Shop Better, Manage Smarter
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm leading-7 text-gray-500">
            WOW is a modern online shopping platform with smart product
            browsing, cart, checkout, order tracking, and store management.
          </p>
        </div>

        <div>
          <h3 className="font-black text-red-950">Quick Links</h3>

          <div className="mt-4 space-y-3 text-sm">
            <a href="/" className="block text-gray-500 hover:text-red-900">
              Home
            </a>
            <a
              href="/products"
              className="block text-gray-500 hover:text-red-900"
            >
              Products
            </a>
            <a href="/cart" className="block text-gray-500 hover:text-red-900">
              Cart
            </a>
            <a
              href="/account/orders"
              className="block text-gray-500 hover:text-red-900"
            >
              My Orders
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-black text-red-950">Contact</h3>

          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <Phone size={16} />
              +94 77 123 4567
            </p>

            <p className="flex items-center gap-2">
              <Mail size={16} />
              hello@wow.com
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={16} />
              Colombo, Sri Lanka
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-red-100 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} WOW. All rights reserved.
      </div>
    </footer>
  );
}
