import { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../api/contactApi";
import type { Contact } from "../types/Contact";
import ContactCard from "../components/contacts/ContactCard";
import toast from "react-hot-toast";

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch {
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleView = (contact: Contact) => {
    console.log(contact);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">No contacts found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;