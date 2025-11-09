import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
  userAgent?: string;
  ip?: string;
  replacedByTokenId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  tokenHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  revokedAt: Date,
  userAgent: String,
  ip: String,
  replacedByTokenId: {
    type: Schema.Types.ObjectId,
    ref: "RefreshToken",
  },
});

RefreshTokenSchema.virtual("isActive").get(function (this: IRefreshToken) {
  return !this.revokedAt && this.expiresAt > new Date();
});

export default mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);
