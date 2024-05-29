import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  uploadAvatar,
} from "../controllers/authControllers.js";
import { auth } from "../helpers/auth.js";
import avatar from "../helpers/avatar.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", auth, logout);

authRouter.get("/current", auth, getCurrentUser);

authRouter.patch("/avatars", auth, avatar.single("avatar"), uploadAvatar);

export default authRouter;
