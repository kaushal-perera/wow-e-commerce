import mongoose, { Schema, models, model } from "mongoose";

export type ProductDocument = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  discountPrice?: number;
  sku: string;
  stockQuantity: number;
  reorderLevel: number;
  images: string[];
  brand?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const ProductSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    reorderLevel: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },

    images: {
      type: [String],
      default: [],
    },

    brand: {
      type: String,
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  models.Product || model<ProductDocument>("Product", ProductSchema);

export default Product;
