import api from "./axios";
import type { Contact } from "../types/Contact";

export const getContacts = async (): Promise<Contact[]> => {
  const response = await api.get("/contacts");
  return response.data;
};

export const createContact = async (contact: Contact) => {
  const response = await api.post("/contacts", contact);
  return response.data;
};

export const deleteContact = async (id: number) => {
  await api.delete(`/contacts/${id}`);
};

export const searchContacts = async (keyword: string) => {
  const response = await api.get(`/contacts/search?keyword=${keyword}`);
  return response.data;
};