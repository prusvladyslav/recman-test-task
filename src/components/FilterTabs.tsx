import { type FilterType, useTodoStore } from "../store/todo-store";

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export function FilterTabs() {
  const { filter, setFilter, getStats } = useTodoStore();
  const stats = getStats();

  return (
    <div className="flex items-center justify-between">
      <div className="flex bg-gray-100 rounded-lg p-1">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${
                filter === key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            {label}
            {key === "active" && stats.active > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                {stats.active}
              </span>
            )}
            {key === "completed" && stats.completed > 0 && (
              <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                {stats.completed}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {stats.total} {stats.total === 1 ? "task" : "tasks"} total
      </div>
    </div>
  );
}
