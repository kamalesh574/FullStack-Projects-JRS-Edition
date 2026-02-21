import { useEffect, useState } from "react";
import { getContacts } from "../api/contactApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import type { Contact } from "../types/Contact";
import { FaGlobe, FaUsers, FaCheckCircle, FaChartLine } from "react-icons/fa";

// Professional color palette matching your theme
const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

const Analytics = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getContacts();
        setContacts(data);
      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Data Transformation Logic ---
  const domainCount: Record<string, number> = {};
  contacts.forEach((c) => {
    const domain = c.email?.split("@")[1] || "unknown";
    domainCount[domain] = (domainCount[domain] || 0) + 1;
  });

  const pieData = Object.keys(domainCount).map((key) => ({
    name: key,
    value: domainCount[key],
  }));

  const validContacts = contacts.filter(
    (c): c is Contact & { id: number } => typeof c.id === "number",
  );

  const growthData = [
    { range: "Initial", count: validContacts.filter((c) => c.id <= 10).length },
    {
      range: "Growth",
      count: validContacts.filter((c) => c.id > 10 && c.id <= 20).length,
    },
    { range: "Latest", count: validContacts.filter((c) => c.id > 20).length },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FaChartLine className="text-blue-500" /> System Analytics
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time data insights from your contact database.
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
          Live Sync Active
        </div>
      </div>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Contacts",
            val: contacts.length,
            icon: FaUsers,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Unique Domains",
            val: pieData.length,
            icon: FaGlobe,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "System Health",
            val: "99.9%",
            icon: FaCheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-xl group hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-white mt-1">{stat.val}</p>
              </div>
              <div
                className={`p-4 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-8">Database Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={growthData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis
                dataKey="range"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />

              {/* cursor={false} removes the white/grey block behind the bar on hover */}
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />

              {/* activeBar defines the color when you hover over the bar itself */}
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                activeBar={{ fill: "#60a5fa" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-8">
            Domain Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip
                // This ensures the text inside the pie chart tooltip is white, not black
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                stroke="none"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-xs text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
