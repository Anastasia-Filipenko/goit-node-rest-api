import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();

  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const removeContact = contacts[index];

  contacts.splice(index, 1);

  await writeContacts(contacts);

  return removeContact;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();

  const newContact = { id: crypto.randomUUID(), name, email, phone };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}

async function updateContact(id, contact) {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }
  const updatedContact = {
    ...contacts[index],
    ...(contact.name && { name: contact.name }),
    ...(contact.email && { email: contact.email }),
    ...(contact.phone && { name: contact.phone }),
  };

  const newContacts = [
    ...contacts.slice(0, index),
    updatedContact,
    ...contacts.slice(index + 1),
  ];

  await writeContacts(newContacts);

  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
