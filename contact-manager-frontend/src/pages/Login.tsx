import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-card p-8 rounded-2xl w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          ContactPro Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-primary hover:bg-blue-600 p-3 rounded-lg font-semibold transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;