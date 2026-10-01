type Activity = {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
};

export default function RecentActivity({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-900">
          Recent Activity
        </h2>

        <p className="mt-1 text-xs text-gray-400">
          Latest administrative actions
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">
              No administrative activity yet.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-3 px-5 py-4"
            >
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#15945c]" />

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {activity.action}
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  {activity.description}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  {new Date(activity.createdAt).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}