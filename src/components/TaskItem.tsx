import type React from "react";

import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { type Task, useTodoStore } from "../store/todo-store";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";

interface TaskItemProps {
  task: Task;
  index: number;
}

export function TaskItem({ task, index }: TaskItemProps) {
  const {
    toggleTask,
    deleteTask,
    updateTask,
    toggleTaskSelection,
    selectedTasks,
    editingTask,
    setEditingTask,
  } = useTodoStore();

  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const isSelected = selectedTasks.has(task.id);
  const isEditing = editingTask === task.id;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ task, index, type: "task" }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        getData: () => ({ index, type: "task", taskId: task.id }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
      })
    );
  }, [task, index]);

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isEditing) {
      if (editText.trim() && editText !== task.text) {
        updateTask(task.id, editText.trim());
      } else {
        setEditText(task.text);
      }
      setEditingTask(null);
    } else {
      setEditingTask(task.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditText(task.text);
      setEditingTask(null);
    }
  };

  return (
    <div
      ref={ref}
      className={`
        group relative bg-white border rounded-lg shadow-sm transition-all duration-200
        ${isDragging ? "opacity-50 scale-95 shadow-lg rotate-2" : ""}
        ${isDraggedOver ? "border-blue-300 bg-blue-50" : "border-gray-200"}
        ${isSelected ? "ring-2 ring-blue-500 border-blue-300" : ""}
        ${task.completed ? "bg-gray-50" : ""}
        hover:shadow-md hover:border-gray-300
      `}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
      )}

      <div className="p-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onChange={() => toggleTaskSelection(task.id)}
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  onClick={() => toggleTask(task.id)}
                  className={`
                    flex-1 text-sm break-words cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors
                    ${
                      task.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-900"
                    }
                  `}
                >
                  {task.text}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title={isEditing ? "Save" : "Edit"}
            >
              {isEditing ? (
                <span className="text-blue-500 text-sm">✓</span>
              ) : (
                <span>✏️</span>
              )}
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
