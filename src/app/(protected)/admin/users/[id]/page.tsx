import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import ResetPasswordCard from "@/components/admin/users/ResetPasswordCard";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { STAFF_ROLES } from "@/lib/roles";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type StaffUser = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "INVENTORY_MANAGER" | "SALES_STAFF" | "DELIVERY_STAFF";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

async function getStaffUser(id: string): Promise<StaffUser> {
  await connectDB();

  const user = await UserModel.findOne({
    _id: id,
    role: {
      $in: STAFF_ROLES,
    },
  })
    .select("-password")
    .lean();

  if (!user) {
    notFound();
  }

  return JSON.parse(JSON.stringify(user));
}

function getRoleLabel(role: string) {
  return role.replaceAll("_", " ");
}

function getRoleClass(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-red-50 text-red-700";
    case "INVENTORY_MANAGER":
      return "bg-purple-50 text-purple-700";
    case "SALES_STAFF":
      return "bg-blue-50 text-blue-700";
    case "DELIVERY_STAFF":
      return "bg-orange-50 text-orange-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default async function StaffUserDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getStaffUser(id);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Staff User Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View staff details and manage password.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/users"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 hover:bg-red-50"
          >
            <ArrowLeft size={17} />
            Back
          </Link>

          <Link
            href={`/admin/users/${user._id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-red-950 px-4 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:from-red-800 hover:to-red-950"
          >
            <Edit size={17} />
            Edit
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-lg shadow-red-950/5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-red-700 to-red-950 text-white shadow-lg shadow-red-900/20">
                <User size={44} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-red-950">
                {user.fullName}
              </h2>

              <p className="mt-1 text-sm text-gray-500">{user.email}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ${getRoleClass(
                    user.role,
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    user.status === "ACTIVE"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-red-50 p-4">
                <Mail className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Email
                </p>
                <p className="mt-1 break-all font-bold text-red-950">
                  {user.email}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <Phone className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Phone
                </p>
                <p className="mt-1 font-bold text-red-950">
                  {user.phone || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <ShieldCheck className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">Role</p>
                <p className="mt-1 font-bold text-red-950">
                  {getRoleLabel(user.role)}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <User className="text-red-900" size={22} />
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Created Date
                </p>
                <p className="mt-1 font-bold text-red-950">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ResetPasswordCard user={user} />
        </div>
      </section>
    </div>
  );
}
