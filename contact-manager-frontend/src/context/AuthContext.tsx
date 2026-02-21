import { createContext, useContext, useState } from "react";

interface AuthState {
  username: string | null;
  role: string | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuthState: (auth: AuthState) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState>({
    username: null,
    role: null,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};