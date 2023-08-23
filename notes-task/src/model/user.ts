import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
