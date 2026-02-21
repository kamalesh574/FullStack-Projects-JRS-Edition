import { useEffect, useState } from "react";
import { getContacts } from "../api/contactApi";
import { FaUsers, FaUserShield, FaSignal } from "react-icons/fa";

const Dashboard = () => {
  const [totalContacts, setTotalContacts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getContacts();
        setTotalContacts(data.length);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-slate-800 shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Admin 🚀</h2>
          <p className="text-slate-400 max-w-md">
            Your ContactPro system is running smoothly. You have full administrative control over all records.
          </p>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Contacts Card */}
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <FaUsers size={24} />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Database</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Total Contacts</p>
          <h4 className="text-4xl font-bold mt-1 text-white">
            {loading ? "..." : totalContacts}
          </h4>
        </div>

        {/* Admin Users Card */}
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <FaUserShield size={24} />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Security</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Admin Users</p>
          <h4 className="text-4xl font-bold mt-1 text-white">1</h4>
        </div>

        {/* System Status Card */}
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 hover:border-green-500/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
              <FaSignal size={24} />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Network</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h4 className="text-xl font-bold text-green-400">Online</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;