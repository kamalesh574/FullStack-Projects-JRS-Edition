import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaTachometerAlt, FaAddressBook } from "react-icons/fa";

const Sidebar = () => {
  const { auth } = useAuth();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-slate-800 text-white"
      : "text-gray-400 hover:text-white";

  return (
    <aside className="w-64 bg-slate-900 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-blue-400">
        ContactPro
      </h1>

      <nav className="flex flex-col gap-4">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 p-3 rounded-lg ${isActive(
            "/dashboard"
          )}`}
        >
          <FaTachometerAlt />
          Dashboard
        </Link>

        {/* Show Contacts only for ADMIN */}
        {auth.role === "ADMIN" && (
          <Link
            to="/contacts"
            className={`flex items-center gap-3 p-3 rounded-lg ${isActive(
              "/contacts"
            )}`}
          >
            <FaAddressBook />
            Contacts
          </Link>
        )}
      </nav>

      <div className="mt-auto text-xs text-gray-500">
        Role: {auth.role}
      </div>
    </aside>
  );
};

export default Sidebar;