import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import contacts from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    console.log("req.user в getAllContacts:", req.user);
    const allContacts = await contacts.find({ owner: req.user.id });
    console.log("req.user:", req.user);
    return res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contacts.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (contact === null) {
      throw HttpError(404);
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contacts.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

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

    const contact = await contacts.create({
      ...req.body,
      owner: req.user.id,
    });

    return res.status(201).send(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const response = await contacts.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,

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
};

export async function updateStatusContact(req, res, next) {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const newStatus = req.body.favorite;

    const response = await contacts.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
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
