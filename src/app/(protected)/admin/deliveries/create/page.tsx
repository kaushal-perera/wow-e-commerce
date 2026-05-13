import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";
import DeliveryForm from "@/components/admin/deliveries/DeliveryForm";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { USER_ROLES } from "@/lib/roles";

type OrderData = {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
};

type DeliveryStaffData = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
};

async function getOrders(): Promise<OrderData[]> {
  await connectDB();

  const orders = await Order.find({
    orderStatus: {
      $in: ["CONFIRMED", "PROCESSING", "PACKED", "DISPATCHED"],
    },
  })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(orders));
}

async function getStaff(): Promise<DeliveryStaffData[]> {
  await connectDB();

  const staff = await User.find({
    role: USER_ROLES.DELIVERY_STAFF,
    status: "ACTIVE",
  })
    .select("-password")
    .sort({ fullName: 1 })
    .lean();

  return JSON.parse(JSON.stringify(staff));
}

export default async function CreateDeliveryPage() {
  const [orders, staff] = await Promise.all([getOrders(), getStaff()]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Truck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Create Delivery
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Assign order to delivery process.
            </p>
          </div>
        </div>

        <Link
          href="/admin/deliveries"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 hover:bg-red-50"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </section>

      <DeliveryForm orders={orders as any} staff={staff as any} />
    </div>
  );
}
