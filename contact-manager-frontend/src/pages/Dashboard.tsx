import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 space-y-6">
        <Navbar />

        <div className="bg-card rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Welcome Back 🚀
          </h3>
          <p className="text-slate-400">
            Manage your contacts with full control and role-based access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;