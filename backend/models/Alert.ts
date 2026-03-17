import mongoose, { Document, Schema } from "mongoose";

export type AlertCreatedByRole = "admin" | "volunteer";
export type AlertStatus = "pending" | "active";

export interface IAlert extends Document {
  title: string;
  message: string;
  createdByRole: AlertCreatedByRole;
  status: AlertStatus;
  acknowledgedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },
    createdByRole: {
      type: String,
      required: true,
      enum: ["admin", "volunteer"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "active"],
      default: "pending",
    },
    acknowledgedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

export const AlertModel = mongoose.model<IAlert>("Alert", AlertSchema);
