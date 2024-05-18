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

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", validateId, getOneContact);

contactsRouter.delete("/:id", validateId, deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", validateId, updateContact);

contactsRouter.patch("/:id/favorite", validateId, updateStatusContact);

export default contactsRouter;
