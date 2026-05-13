import mongoose, { Schema, models, model } from "mongoose";

export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED";

export type DeliveryDocument = {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  deliveryStaffId?: mongoose.Types.ObjectId;
  trackingNumber: string;
  deliveryStatus: DeliveryStatus;
  estimatedDeliveryDate?: Date;
  pickedUpDate?: Date;
  deliveredDate?: Date;
  failedDate?: Date;
  returnedDate?: Date;
  deliveryNotes?: string;
  createdAt: Date;
  updatedAt: Date;
};

const DeliverySchema = new Schema<DeliveryDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    deliveryStaffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    deliveryStatus: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "PICKED_UP",
        "IN_TRANSIT",
        "DELIVERED",
        "FAILED",
        "RETURNED",
      ],
      default: "PENDING",
    },

    estimatedDeliveryDate: Date,
    pickedUpDate: Date,
    deliveredDate: Date,
    failedDate: Date,
    returnedDate: Date,

    deliveryNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Delivery =
  models.Delivery || model<DeliveryDocument>("Delivery", DeliverySchema);

export default Delivery;
