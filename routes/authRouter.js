import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/authControllers.js";
import { auth } from "../helpers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", auth, logout);

authRouter.get("/current", auth, getCurrentUser);

export default authRouter;
