import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  reVerify,
  register,
  uploadAvatar,
  verify,
} from "../controllers/authControllers.js";
import { auth } from "../helpers/auth.js";
import avatar from "../helpers/avatar.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", auth, logout);

authRouter.get("/current", auth, getCurrentUser);

authRouter.patch("/avatars", auth, avatar.single("avatar"), uploadAvatar);

authRouter.get("/verify/:verificationToken", verify);

authRouter.post("/verify", reVerify);
export default authRouter;
