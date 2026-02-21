import { FiUsers, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="w-64 bg-card p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-10 text-primary">
          ContactPro
        </h1>

        <ul className="space-y-6">
          <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
            <FiUsers />
            Contacts
          </li>
        </ul>
      </div>

      <button className="flex items-center gap-2 text-red-400 hover:text-red-500">
        <FiLogOut />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;