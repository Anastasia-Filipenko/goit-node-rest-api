import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

import contacts from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await contacts.find();
    console.table(allContacts);
    return res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contacts.findById(req.params.id);

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
    const contact = await contacts.findByIdAndDelete(req.params.id);

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

    const { name, email, phone, favorite } = req.body;

    const contact = await contacts.create({ name, email, phone, favorite });

    return res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newContact = req.body;
    const { name, email, phone, favorite } = newContact;

    if (!name && !email && !phone && !favorite) {
      throw HttpError(400, "Body must have at least one field");
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const response = await contacts.findByIdAndUpdate(id, newContact);

    if (!response) {
      throw HttpError(404);
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export async function updateStatusContact(req, res, next) {
  try {
    const id = req.params.id;
    const newStatus = req.body.favorite;

    const response = await contacts.findByIdAndUpdate(id, {
      favorite: newStatus,
    });
    if (!response) {
      throw HttpError(404);
    }
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
