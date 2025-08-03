import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { type Todo, useTodoStore } from "../store/todo-store";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";

interface TodoItemProps {
  todo: Todo;
  index: number;
}

export function TodoItem({ todo, index }: TodoItemProps) {
  const { toggleTask, deleteTask } = useTodoStore();
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ todo, index }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        getData: () => ({ index }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
      })
    );
  }, [todo, index]);

  return (
    <div
      ref={ref}
      className={`
        group flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm
        transition-all duration-200 cursor-move
        ${isDragging ? "opacity-50 scale-95 shadow-lg" : ""}
        ${isDraggedOver ? "border-blue-300 bg-blue-50" : ""}
        hover:shadow-md hover:border-gray-300
      `}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => toggleTask(todo.id)}
        id={`todo-${todo.id}`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`
            text-sm break-words flex-1
            ${todo.completed ? "text-gray-500 line-through" : "text-gray-900"}
          `}
          >
            {todo.text}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(todo.createdAt).toLocaleDateString()}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteTask(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50"
        aria-label={`Delete task: ${todo.text}`}
      >
        🗑️
      </Button>
    </div>
  );
}
