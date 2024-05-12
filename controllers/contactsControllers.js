import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import contacts from "../models/contacts.js";
import mongoose from "mongoose";

export const getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await contacts.find();

    return res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw HttpError(404);
    }
    const contact = await contacts.findById(id);

    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw HttpError(404);
    }

    const contact = await contacts.findByIdAndDelete(id);

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

    return res.status(201).send(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw HttpError(404);
    }

    const newContact = req.body;

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const response = await contacts.findByIdAndUpdate(id, newContact, {
      new: true,
    });

    if (!response) {
      throw HttpError(404);
    }

    return res.send(response);
  } catch (error) {
    next(error);
  }
};

export async function updateStatusContact(req, res, next) {
  try {
    const { id } = req.params;

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      throw HttpError(404);
    }

    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const newStatus = req.body.favorite;

    const response = await contacts.findByIdAndUpdate(
      id,
      {
        favorite: newStatus,
      },
      {
        new: true,
      }
    );

    if (!response) {
      throw HttpError(404);
    }
    return res.send(response);
  } catch (error) {
    next(error);
  }
}
