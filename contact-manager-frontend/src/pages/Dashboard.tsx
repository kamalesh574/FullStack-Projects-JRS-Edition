import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import api from "../api/axios";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    api
      .get("/contacts")
      .then((res) => setContacts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 space-y-6">
        <Navbar />

        <div className="bg-card rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Welcome Back 🚀</h3>
          <p className="text-slate-400 mb-6">
            Manage your contacts with full control and role-based access.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
              <h4 className="text-slate-400 text-sm">Total Contacts</h4>
              <p className="text-2xl font-bold mt-2">12</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
              <h4 className="text-slate-400 text-sm">Admins</h4>
              <p className="text-2xl font-bold mt-2">1</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
              <h4 className="text-slate-400 text-sm">System Status</h4>
              <p className="text-green-400 font-semibold mt-2">Online</p>
            </div>
          </div>

          <div className="space-y-2">
            {contacts.map((c: any) => (
              <div
                key={c.id}
                className="p-3 border border-slate-700 rounded-lg bg-slate-800/50"
              >
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
