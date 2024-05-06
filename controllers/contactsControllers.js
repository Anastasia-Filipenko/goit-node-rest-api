import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.id);

    if (!contact) {
      throw HttpError(404);
    }

    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(req.params.id);

    if (!contact) {
      throw HttpError(404);
    }

    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { name, email, phone } = req.body;

    const contact = await contactsService.addContact(name, email, phone);

    return res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newContact = req.body;
    const { name, email, phone } = newContact;

    if (!name && !email && !phone) {
      throw HttpError(400, "Body must have at least one field");
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const response = await contactsService.updateContact(id, newContact);

    if (!response) {
      throw HttpError(404);
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
