import { useTodoStore } from "../store/todo-store";
import { Button } from "./Button";

export function BulkOperations() {
  const {
    selectedTasks,
    clearSelection,
    bulkDelete,
    bulkToggleComplete,
    bulkMoveToColumn,
    columns,
  } = useTodoStore();

  if (selectedTasks.size === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {selectedTasks.size} task{selectedTasks.size !== 1 ? "s" : ""}{" "}
          selected
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkToggleComplete(true)}
            className="text-green-600 hover:text-green-700"
          >
            ✓ Complete
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkToggleComplete(false)}
            className="text-orange-600 hover:text-orange-700"
          >
            ⏱️ Incomplete
          </Button>

          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-700 bg-transparent"
            >
              📁 Move to...
            </Button>
            <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-40">
              {columns.map((column) => (
                <button
                  key={column.id}
                  onClick={() => bulkMoveToColumn(column.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                >
                  {column.title}
                </button>
              ))}
            </div>
          </div>

          <Button variant="danger" size="sm" onClick={bulkDelete}>
            🗑️ Delete
          </Button>

          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
