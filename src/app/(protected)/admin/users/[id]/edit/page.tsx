import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import StaffUserForm from "@/components/admin/users/StaffUserForm";
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

export default async function EditStaffUserPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getStaffUser(id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white p-5 shadow-lg shadow-red-950/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-900">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-red-950">
              Edit Staff User
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update internal user details and access role.
            </p>
          </div>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 text-sm font-bold text-red-900 hover:bg-red-50"
        >
          <ArrowLeft size={17} />
          Back
        </Link>
      </section>

      <StaffUserForm mode="edit" user={user} />
    </div>
  );
}
