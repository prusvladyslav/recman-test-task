import { useTodoStore, type FilterType } from "../store/todo-store";
import { Input } from "./Input";
import { Button } from "./Button";

const filters: { key: FilterType; label: string; icon: string }[] = [
  { key: "all", label: "All Tasks", icon: "📋" },
  { key: "incomplete", label: "Active", icon: "⏳" },
  { key: "completed", label: "Completed", icon: "✅" },
];

export function SearchAndFilter() {
  const { searchQuery, setSearchQuery, filter, setFilter, getStats } =
    useTodoStore();
  const stats = getStats();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {filters.map(({ key, label, icon }) => (
          <Button
            key={key}
            variant={filter === key ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter(key)}
            className="flex items-center gap-2"
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
            {key === "incomplete" && stats.incomplete > 0 && (
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                {stats.incomplete}
              </span>
            )}
            {key === "completed" && stats.completed > 0 && (
              <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                {stats.completed}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
