import { useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useTodoStore } from "../store/todo-store";
import { TodoItem } from "./TodoItem";
import { Button } from "./Button";

interface TodoListProps {
  columnId: string;
}

export function TodoList({ columnId }: TodoListProps) {
  const { getFilteredTasks, bulkToggleComplete, reorderTasks, getStats } =
    useTodoStore();
  const todos = getFilteredTasks(columnId);
  const stats = getStats();

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const sourceIndex =
          typeof source.data.index === "number" ? source.data.index : 0;
        const destinationIndex =
          typeof destination.data.index === "number"
            ? destination.data.index
            : 0;

        if (sourceIndex !== destinationIndex) {
          reorderTasks(columnId, sourceIndex, destinationIndex);
        }
      },
    });
  }, [reorderTasks, columnId]);

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="text-6xl mx-auto">📋</div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500">
          {stats.total === 0
            ? "Add your first task to get started!"
            : "Try changing the filter to see your tasks."}
        </p>
      </div>
    );
  }

  const completedTasks = todos.filter((todo) => todo.completed);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {todos.map((todo, index) => (
          <TodoItem key={todo.id} todo={todo} index={index} />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="flex justify-center pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => bulkToggleComplete(false)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear {completedTasks.length} completed{" "}
            {completedTasks.length === 1 ? "task" : "tasks"}
          </Button>
        </div>
      )}
    </div>
  );
}
