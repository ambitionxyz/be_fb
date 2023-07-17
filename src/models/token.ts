import * as mongoose from "mongoose";
import { tokenTypes } from "../config/tokens";
import { IToken } from "../types/Models/IToken";

const tokenSchema = new mongoose.Schema<IToken>(
  {
    id: {
      type: String,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        // tokenTypes.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.pre("save", async function (next: () => void) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
