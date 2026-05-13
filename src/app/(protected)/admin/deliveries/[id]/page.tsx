import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import DeliveryUpdateForm from "@/components/admin/deliveries/DeliveryUpdateForm";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import UserModel from "@/models/User";
import { USER_ROLES } from "@/lib/roles";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getDelivery(id: string) {
  await connectDB();

  const delivery = await Delivery.findById(id)
    .populate({
      path: "orderId",
      select:
        "orderNumber customerId items totalAmount orderStatus paymentStatus paymentMethod deliveryAddress createdAt",
      populate: {
        path: "customerId",
        select: "fullName email phone",
      },
    })
    .populate("deliveryStaffId", "fullName email phone role status")
    .lean();

  if (!delivery) {
    notFound();
  }

  return JSON.parse(JSON.stringify(delivery));
}

async function getStaff() {
  await connectDB();

  const staff = await UserModel.find({
    role: USER_ROLES.DELIVERY_STAFF,
    status: "ACTIVE",
  })
    .select("-password")
    .sort({ fullName: 1 })
    .lean();

  return JSON.parse(JSON.stringify(staff));
}

function getStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700";
    case "ASSIGNED":
      return "bg-blue-50 text-blue-700";
    case "PICKED_UP":
      return "bg-purple-50 text-purple-700";
    case "IN_TRANSIT":
      return "bg-orange-50 text-orange-700";
    case "DELIVERED":
      return "bg-green-50 text-green-700";
    case "FAILED":
    case "RETURNED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default async function AdminDeliveryDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const [delivery, staff] = await Promise.all([getDelivery(id), getStaff()]);

  const order = delivery.orderId;
  const customer = order.customerId;
  const address = order.deliveryAddress;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Truck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              {delivery.trackingNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and update delivery information.
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

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-xl font-black text-red-950">
                  Delivery Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Order: {order.orderNumber}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusClass(
                  delivery.deliveryStatus,
                )}`}
              >
                {delivery.deliveryStatus}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-red-50 p-4">
                <ShoppingCart className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Order Number
                </p>
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="mt-1 block font-bold text-red-950 hover:underline"
                >
                  {order.orderNumber}
                </Link>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <Package className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Order Amount
                </p>
                <p className="mt-1 font-bold text-red-950">
                  Rs. {order.totalAmount}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <Calendar className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Estimated Delivery
                </p>
                <p className="mt-1 font-bold text-red-950">
                  {delivery.estimatedDeliveryDate
                    ? new Date(
                        delivery.estimatedDeliveryDate,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <User className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Delivery Staff
                </p>
                <p className="mt-1 font-bold text-red-950">
                  {delivery.deliveryStaffId?.fullName || "Unassigned"}
                </p>
              </div>
            </div>

            {delivery.deliveryNotes && (
              <div className="mt-5 rounded-2xl bg-red-50 p-4">
                <p className="text-xs font-semibold text-gray-500">
                  Delivery Notes
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {delivery.deliveryNotes}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <h2 className="text-lg font-black text-red-950">
              Customer and Address
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-red-50 p-4">
                <User className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Customer
                </p>
                <p className="mt-1 font-bold text-red-950">
                  {customer?.fullName || address.fullName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {customer?.email || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <Phone className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Phone
                </p>
                <p className="mt-1 font-bold text-red-950">{address.phone}</p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4 sm:col-span-2">
                <MapPin className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Delivery Address
                </p>
                <p className="mt-1 font-bold leading-6 text-red-950">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city}
                  {address.postalCode ? `, ${address.postalCode}` : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <h2 className="text-lg font-black text-red-950">
              Delivery Timeline
            </h2>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-xs font-semibold text-gray-500">Created</p>
                <p className="mt-1 font-bold text-red-950">
                  {new Date(delivery.createdAt).toLocaleString()}
                </p>
              </div>

              {delivery.pickedUpDate && (
                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Picked Up
                  </p>
                  <p className="mt-1 font-bold text-red-950">
                    {new Date(delivery.pickedUpDate).toLocaleString()}
                  </p>
                </div>
              )}

              {delivery.deliveredDate && (
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-xs font-semibold text-green-700">
                    Delivered
                  </p>
                  <p className="mt-1 font-bold text-green-800">
                    {new Date(delivery.deliveredDate).toLocaleString()}
                  </p>
                </div>
              )}

              {delivery.failedDate && (
                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-semibold text-red-700">Failed</p>
                  <p className="mt-1 font-bold text-red-800">
                    {new Date(delivery.failedDate).toLocaleString()}
                  </p>
                </div>
              )}

              {delivery.returnedDate && (
                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-semibold text-red-700">Returned</p>
                  <p className="mt-1 font-bold text-red-800">
                    {new Date(delivery.returnedDate).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <DeliveryUpdateForm delivery={delivery} staff={staff} />
        </div>
      </section>
    </div>
  );
}
