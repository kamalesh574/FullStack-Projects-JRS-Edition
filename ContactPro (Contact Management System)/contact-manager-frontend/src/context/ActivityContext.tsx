import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

export type ActivityType = "CREATE" | "DELETE" | "IMPORT" | "EXPORT";

export interface Activity {
  id: number;
  action: ActivityType;
  description: string;
  timestamp: string;
}

interface ActivityContextType {
  activities: Activity[];
  logActivity: (action: ActivityType, description: string) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuth();

  const storageKey = auth.username
    ? `activities_${auth.username}`
    : "activities_guest";

  const [activities, setActivities] = useState<Activity[]>([]);

  // ✅ Load activities when user changes
  useEffect(() => {
    if (!auth.username) {
      setActivities([]);
      return;
    }

    const stored = localStorage.getItem(storageKey);
    setActivities(stored ? JSON.parse(stored) : []);
  }, [auth.username, storageKey]);

  // ✅ Save whenever activities change
  useEffect(() => {
    if (!auth.username) return;

    localStorage.setItem(storageKey, JSON.stringify(activities));
  }, [activities, auth.username, storageKey]);

  const logActivity = (action: ActivityType, description: string) => {
    if (!auth.username) return;

    const newActivity: Activity = {
      id: Date.now(),
      action,
      description,
      timestamp: new Date().toLocaleString(),
    };

    setActivities((prev) => [newActivity, ...prev]);
  };

  const clearActivities = () => {
    if (!auth.username) return;

    setActivities([]);
    localStorage.removeItem(storageKey);
  };

  return (
    <ActivityContext.Provider
      value={{ activities, logActivity, clearActivities }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used inside ActivityProvider");
  }
  return context;
};