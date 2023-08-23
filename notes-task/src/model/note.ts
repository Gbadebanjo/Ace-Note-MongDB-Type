import { Schema, model } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    status: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Note = model('Note', noteSchema)