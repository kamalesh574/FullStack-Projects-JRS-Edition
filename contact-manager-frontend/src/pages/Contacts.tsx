import { useEffect, useState } from "react";
import { getContacts, deleteContact, searchContacts } from "../api/contactApi";
import type { Contact } from "../types/Contact";

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteContact(id);
    fetchContacts();
  };

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (value.trim() === "") {
      fetchContacts();
    } else {
      const data = await searchContacts(value);
      setContacts(data);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Contacts</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 mb-6 w-full md:w-1/3"
      />

      {loading ? (
        <p>Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500">No contacts found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition"
            >
              <h2 className="font-semibold text-lg">{contact.name}</h2>
              <p className="text-gray-600">{contact.phone}</p>
              <button
                onClick={() => handleDelete(contact.id!)}
                className="mt-4 text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;