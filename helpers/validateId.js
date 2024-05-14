import mongoose from "mongoose";
import HttpError from "./HttpError.js";

export const validateId = (id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    throw HttpError(404);
  }
};
