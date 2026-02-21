import { useEffect, useState, useRef } from "react";
import {
  getContacts,
  deleteContact,
  searchContacts,
  createContact,
} from "../api/contactApi";
import type { Contact } from "../types/Contact";
import ContactCard from "../components/contacts/ContactCard";
import toast from "react-hot-toast";
import AddContactModal from "../components/contacts/AddContactModal";
import DeleteConfirmModal from "../components/contacts/DeleteConfirmModal";
import ContactDrawer from "../components/contacts/ContactDrawer";
import { FaPlus, FaSearch, FaUpload, FaDownload } from "react-icons/fa";
import Papa from "papaparse";
import { useActivity } from "../context/ActivityContext";

const Contacts = () => {
  // ---------------- STATE ----------------
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [search, setSearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { logActivity } = useActivity();

  // ---------------- FETCH CONTACTS ----------------
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchContacts();
  }, []);

  // ---------------- DEBOUNCED SEARCH ----------------
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.trim() === "") {
        fetchContacts();
      } else {
        try {
          const data = await searchContacts(search);
          setContacts(data);
        } catch {
          toast.error("Search failed");
        }
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // ---------------- DELETE ----------------
  const confirmDelete = async () => {
    if (!deleteId) return;

    const contactToDelete = contacts.find((c) => c.id === deleteId);

    try {
      await deleteContact(deleteId);

      setContacts((prev) => prev.filter((c) => c.id !== deleteId));

      logActivity(
        "DELETE",
        `Deleted contact "${contactToDelete?.name ?? "Unknown"}"`
      );

      toast.success("Contact deleted successfully");
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setDeleteId(null);
    }
  };

  // ---------------- CSV IMPORT ----------------
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          let importCount = 0;

          for (const row of results.data as any[]) {
            if (!row.name && !row.Name) continue;

            await createContact({
              name: row.Name || row.name,
              email: row.Email || row.email,
              phone: row.Phone || row.phone,
            });

            importCount++;
          }

          logActivity("IMPORT", `Imported ${importCount} contacts from CSV`);

          toast.success("Contacts imported successfully");
          fetchContacts();
        } catch {
          toast.error("Import failed");
        } finally {
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
    });
  };

  // ---------------- CSV EXPORT ----------------
  const exportCSV = () => {
    if (contacts.length === 0) {
      toast.error("No contacts to export");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone"];
    const rows = contacts.map((c) => [
      c.id,
      c.name,
      c.email ?? "",
      c.phone ?? "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logActivity("EXPORT", "Exported contacts to CSV");

    toast.success("CSV exported successfully");
  };

  // ---------------- RENDER ----------------
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white">Contacts</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage and organize your professional network
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
            />
          </div>

          {/* EXPORT */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 px-5 py-2.5 rounded-xl hover:bg-green-500 transition text-white"
          >
            <FaDownload />
            Export
          </button>

          {/* IMPORT */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-purple-500 text-slate-200 px-5 py-2.5 rounded-xl transition"
          >
            <FaUpload />
            Import
          </button>

          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImport}
          />

          {/* ADD */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-500 transition text-white"
          >
            <FaPlus />
            Add Contact
          </button>
        </div>
      </div>

      {/* CONTACT GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-slate-800/50 rounded-2xl border border-slate-700"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={(id) => setDeleteId(id)}
              onView={(contact) => setSelectedContact(contact)}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      {showModal && (
        <AddContactModal
          onClose={() => setShowModal(false)}
          onSuccess={(newContact) => {
            setContacts((prev) => [...prev, newContact]);
            setShowModal(false);

            logActivity(
              "CREATE",
              `Created contact "${newContact.name}"`
            );

            toast.success("Contact created successfully");
          }}
        />
      )}

      {deleteId && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </div>
  );
};

export default Contacts;