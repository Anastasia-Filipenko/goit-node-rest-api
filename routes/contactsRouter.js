import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { validateId } from "../helpers/validateId.js";
import { auth } from "../helpers/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);

contactsRouter.get("/:id", auth, validateId, getOneContact);

contactsRouter.delete("/:id", auth, validateId, deleteContact);

contactsRouter.post("/", auth, createContact);

contactsRouter.put("/:id", auth, validateId, updateContact);

contactsRouter.patch("/:id/favorite", auth, validateId, updateStatusContact);

export default contactsRouter;
