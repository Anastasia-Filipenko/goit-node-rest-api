import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import { userLoginSchema, userRegisterSchema } from "../schemas/userSchemas.js";
import * as fs from "node:fs/promises";
import path from "node:path";
import gravatar from "gravatar";
import Jimp from "jimp";

export async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const gravatarUrl = gravatar.url(email, {
      s: "250",
      r: "pg",
      d: "identicon",
    });

    const response = await User.create({
      email,
      password: passwordHash,
      avatarURL: gravatarUrl,
    });

    const registeredUser = {
      user: {
        email: response.email,
        subscription: response.subscription,
      },
    };

    return res.status(201).send(registeredUser);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const user = await User.findOne({ email });

    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    await User.findByIdAndUpdate(user._id, { token });
    const loggedUser = {
      token,
      user: {
        email: email,
        subscription: user.subscription,
      },
    };

    return res.status(201).send(loggedUser);
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      throw HttpError(401, "Not authorized");
    }

    const currentUser = {
      email: user.email,
      subscription: user.subscription,
    };
    return res.status(200).send(currentUser);
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      throw HttpError(400, "File not provided");
    }
    const avatar = await Jimp.read(req.file.path);
    await avatar.resize(250, 250).writeAsync(req.file.path);

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const avatarURL = path.join("/avatars", req.file.filename);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    if (user === null) {
      throw HttpError(401);
    }

    return res.status(200).send(user.avatarURL);
  } catch (error) {
    next(error);
  }
}
