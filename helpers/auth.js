import User from "../models/user.js";
import HttpError from "./HttpError.js";
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader === "undefined") {
    throw HttpError(401, "Not authorized");
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "Bearer" || !token) {
    throw HttpError(401, "Not authorized");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      throw HttpError(401, "Not authorized");
    }
    try {
      const user = await User.findById(decode.id);

      if (user === null) {
        throw HttpError(401, "Not authorized");
      }

      if (user.token !== token) {
        throw HttpError(401, "Not authorized");
      }

      req.user = {
        id: decode.id,
      };

      next();
    } catch (error) {
      next(error);
    }
  });
}
