import { useActivity } from "../context/ActivityContext";

const Activity = () => {
  const { activities } = useActivity();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Activity Log</h1>

      {activities.length === 0 ? (
        <p className="text-slate-400">No activity yet.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-blue-400">
                  {activity.action}
                </span>
                <span className="text-xs text-slate-400">
                  {activity.timestamp}
                </span>
              </div>
              <p className="text-slate-300 mt-2">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;