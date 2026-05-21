import mongoose, { Document, Schema } from "mongoose";

export interface ILostPersonReport extends Document {
  fullName: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  createdBy: mongoose.Types.ObjectId;
  isDismissed: boolean;
  dismissedAt?: Date;
  dismissedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LostPersonReportSchema = new Schema<ILostPersonReport>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDismissed: {
      type: Boolean,
      default: false,
    },
    dismissedAt: {
      type: Date,
    },
    dismissedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const LostPersonReportModel = mongoose.model<ILostPersonReport>(
  "LostPersonReport",
  LostPersonReportSchema,
);
