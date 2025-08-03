import { useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useTodoStore, type Task } from "./store/todo-store";
import { Column } from "./components/Column";
import { AddColumn } from "./components/AddColumn";
import { SearchAndFilter } from "./components/SearchAndFilter";
import { BulkOperations } from "./components/BulkOperations";

interface ColumnDragData {
  type: "column";
  index: number;
}

interface ColumnDropData {
  type: "column-drop";
  index: number;
  columnId: string;
}

interface TaskDragData {
  type: "task";
  task: Task;
  index: number;
}

interface TaskDropData {
  type: "task";
  index: number;
  taskId: string;
}

function isColumnDragData(data: unknown): data is ColumnDragData {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "column"
  );
}

function isTaskDragData(data: unknown): data is TaskDragData {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "task"
  );
}

function isColumnDropData(data: unknown): data is ColumnDropData {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "column-drop"
  );
}

function isTaskDropData(data: unknown): data is TaskDropData {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "task"
  );
}

export default function App() {
  const { columns, reorderColumns, moveTask, reorderTasks, tasks } =
    useTodoStore();
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        if (
          isColumnDragData(source.data) &&
          isColumnDropData(destination.data)
        ) {
          if (source.data.index !== destination.data.index) {
            reorderColumns(source.data.index, destination.data.index);
          }
        } else if (isTaskDragData(source.data)) {
          if (isColumnDropData(destination.data)) {
            if (source.data.task.columnId !== destination.data.columnId) {
              moveTask(source.data.task.id, destination.data.columnId);
            }
          } else if (isTaskDropData(destination.data)) {
            const destinationTask = location.current.dropTargets.find(
              (target) => isTaskDropData(target.data)
            );

            if (destinationTask && isTaskDropData(destinationTask.data)) {
              const destinationColumnId = tasks.find(
                (t) => t.id === destinationTask.data.taskId
              )?.columnId;

              if (
                source.data.task.columnId === destinationColumnId &&
                source.data.index !== destination.data.index
              ) {
                reorderTasks(
                  source.data.task.columnId,
                  source.data.index,
                  destination.data.index
                );
              } else if (
                source.data.task.columnId !== destinationColumnId &&
                destinationColumnId
              ) {
                moveTask(source.data.task.id, destinationColumnId);
              }
            }
          }
        }
      },
    });
  }, [reorderColumns, moveTask, reorderTasks, tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchAndFilter />
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6">
          {sortedColumns.map((column, index) => (
            <Column key={column.id} column={column} index={index} />
          ))}
          <AddColumn />
        </div>

        <BulkOperations />
      </div>
    </div>
  );
}
