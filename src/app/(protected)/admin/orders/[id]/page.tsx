import Link from "next/link";
import { ArrowLeft, MapPin, Package, ShoppingCart, User } from "lucide-react";
import OrderStatusForm from "@/components/admin/orders/OrderStatusForm";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getOrder(id: string) {
  await connectDB();

  const order = await Order.findById(id)
    .populate("customerId", "fullName email phone")
    .populate("items.productId", "name sku images stockQuantity")
    .lean();

  if (!order) {
    notFound();
  }

  return JSON.parse(JSON.stringify(order));
}

export default async function AdminOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  const customer =
    typeof order.customerId === "object" ? order.customerId : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <ShoppingCart size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              {order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and update customer order.
            </p>
          </div>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 hover:bg-red-50"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <h2 className="text-lg font-black text-red-950">Order Items</h2>

            <div className="mt-5 space-y-4">
              {order.items.map((item: any, index: number) => (
                <div
                  key={`${item.productSku}-${index}`}
                  className="flex gap-4 rounded-2xl bg-red-50 p-4"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-red-900">
                    {item.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={24} />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-black text-red-950">
                        {item.productName}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        SKU: {item.productSku}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {item.quantity} × Rs. {item.price}
                      </p>
                    </div>

                    <p className="font-black text-red-950">Rs. {item.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <h2 className="text-lg font-black text-red-950">
              Customer Details
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-red-50 p-4">
                <User className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Customer
                </p>
                <p className="mt-1 font-bold text-red-950">
                  {customer?.fullName || order.deliveryAddress.fullName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {customer?.email || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <MapPin className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Delivery Address
                </p>
                <p className="mt-1 font-bold text-red-950">
                  {order.deliveryAddress.fullName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {order.deliveryAddress.phone}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {order.deliveryAddress.line1}
                  {order.deliveryAddress.line2
                    ? `, ${order.deliveryAddress.line2}`
                    : ""}
                  , {order.deliveryAddress.city}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="mt-4 rounded-2xl bg-red-50 p-4">
                <p className="text-xs font-semibold text-gray-500">Notes</p>
                <p className="mt-1 text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <OrderStatusForm order={order} />

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <h2 className="text-lg font-black text-red-950">Order Summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-red-950">
                  Rs. {order.subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-bold text-red-950">
                  Rs. {order.deliveryFee}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="font-bold text-red-950">
                  Rs. {order.discount}
                </span>
              </div>

              <div className="border-t border-red-100 pt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-black text-red-950">Total</span>
                  <span className="font-black text-red-950">
                    Rs. {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-red-50 p-4">
              <p className="text-xs font-semibold text-gray-500">
                Stock Deducted
              </p>
              <p className="mt-1 font-bold text-red-950">
                {order.stockDeducted ? "Yes" : "No"}
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-red-50 p-4">
              <p className="text-xs font-semibold text-gray-500">
                Order Status
              </p>
              <p className="mt-1 font-bold text-red-950">{order.orderStatus}</p>
            </div>

            <div className="mt-4 rounded-2xl bg-red-50 p-4">
              <p className="text-xs font-semibold text-gray-500">
                Payment Status
              </p>
              <p className="mt-1 font-bold text-red-950">
                {order.paymentStatus}
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-red-50 p-4">
              <p className="text-xs font-semibold text-gray-500">
                Created Date
              </p>
              <p className="mt-1 font-bold text-red-950">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
