import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { setAuth } from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    // 🔥 Encode credentials manually
    const encoded = btoa(`${username}:${password}`);

    // Set axios header
    setAuth(username, password);

    const response = await api.get("/auth/me");

    const authData = {
      username: response.data.username,
      role: response.data.role,
      token: encoded, // ✅ store encoded token
    };

    // Save in context
    setAuthState(authData);

    // Persist to localStorage
    localStorage.setItem("auth", JSON.stringify(authData));

    navigate("/dashboard");

  } catch {
    alert("Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
          ContactPro Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;