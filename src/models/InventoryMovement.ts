import mongoose, { Schema, models, model } from "mongoose";

export type InventoryMovementDocument = {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  previousQuantity: number;
  changedQuantity: number;
  newQuantity: number;
  movementType:
    | "STOCK_IN"
    | "STOCK_OUT"
    | "MANUAL_ADJUSTMENT"
    | "ORDER_DEDUCTION"
    | "ORDER_CANCEL_RESTORE"
    | "RETURN_RESTORE";
  reason?: string;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const InventoryMovementSchema = new Schema<InventoryMovementDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    previousQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    changedQuantity: {
      type: Number,
      required: true,
    },

    newQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    movementType: {
      type: String,
      enum: [
        "STOCK_IN",
        "STOCK_OUT",
        "MANUAL_ADJUSTMENT",
        "ORDER_DEDUCTION",
        "ORDER_CANCEL_RESTORE",
        "RETURN_RESTORE",
      ],
      required: true,
    },

    reason: {
      type: String,
      trim: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const InventoryMovement =
  models.InventoryMovement ||
  model<InventoryMovementDocument>(
    "InventoryMovement",
    InventoryMovementSchema,
  );

export default InventoryMovement;
