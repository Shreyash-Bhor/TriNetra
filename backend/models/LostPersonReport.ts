import mongoose, { Document, Schema } from "mongoose";

export interface ILostPersonReport extends Document {
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
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
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true },
);

export const LostPersonReportModel = mongoose.model<ILostPersonReport>(
  "LostPersonReport",
  LostPersonReportSchema,
);
