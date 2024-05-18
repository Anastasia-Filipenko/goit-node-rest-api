import mongoose from "mongoose";
import HttpError from "./HttpError.js";

export const validateId = (req, res, next) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidObjectId) {
    next(HttpError(404, "Invalid id"));
  }
  next();
};
