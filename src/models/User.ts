import mongoose, { Schema, models, model } from "mongoose";
import { USER_ROLES } from "@/lib/roles";

export type UserDocument = {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role:
    | "ADMIN"
    | "CUSTOMER"
    | "INVENTORY_MANAGER"
    | "SALES_STAFF"
    | "DELIVERY_STAFF";
  status: "ACTIVE" | "INACTIVE";
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    address: {
      line1: String,
      line2: String,
      city: String,
      postalCode: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<UserDocument>("User", UserSchema);

export default User;
