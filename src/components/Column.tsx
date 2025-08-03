import type React from "react";

import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { type Column, useTodoStore } from "../store/todo-store";
import { TaskItem } from "./TaskItem";
import { Button } from "./Button";
import { Input } from "./Input";

interface ColumnProps {
  column: Column;
  index: number;
}

export function Column({ column, index }: ColumnProps) {
  const {
    getFilteredTasks,
    addTask,
    deleteColumn,
    updateColumnTitle,
    selectAllInColumn,
    selectedTasks,
  } = useTodoStore();

  const ref = useRef<HTMLDivElement>(null);
  const emptyDropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(column.title);
  const [newTaskText, setNewTaskText] = useState("");

  const tasks = getFilteredTasks(column.id);
  const selectedInColumn = tasks.filter((task) =>
    selectedTasks.has(task.id)
  ).length;
  const allSelected = tasks.length > 0 && selectedInColumn === tasks.length;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ column, index, type: "column" }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        getData: () => ({ index, type: "column-drop", columnId: column.id }),
        canDrop: ({ source }) =>
          source.data.type === "column" || source.data.type === "task",
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
      })
    );
  }, [column, index]);

  useEffect(() => {
    const emptyElement = emptyDropRef.current;
    if (!emptyElement || tasks.length > 0) return;

    return dropTargetForElements({
      element: emptyElement,
      getData: () => ({ index, type: "column-drop", columnId: column.id }),
      canDrop: ({ source }) => source.data.type === "task",
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [column.id, index, tasks.length]);

  const handleTitleEdit = () => {
    if (isEditingTitle) {
      if (titleText.trim() && titleText !== column.title) {
        updateColumnTitle(column.id, titleText.trim());
      } else {
        setTitleText(column.title);
      }
      setIsEditingTitle(false);
    } else {
      setIsEditingTitle(true);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim(), column.id);
      setNewTaskText("");
    }
  };

  return (
    <div
      ref={ref}
      className={`
        group flex flex-col bg-gray-50 rounded-xl border-2 transition-all duration-200
        ${isDragging ? "opacity-60 scale-95 rotate-1 shadow-2xl z-50" : ""}
        ${
          isDraggedOver
            ? "border-blue-400 bg-blue-50 shadow-lg"
            : "border-gray-200"
        }
        w-80 min-w-80 max-w-80 h-fit max-h-[calc(100vh-200px)]
        hover:shadow-md
      `}
    >
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-2 flex-1">
            {isEditingTitle ? (
              <Input
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleEdit();
                  if (e.key === "Escape") {
                    setTitleText(column.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="text-lg font-semibold flex-1"
                autoFocus
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900 transition-colors flex-1">
                {column.title}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <>
                <button
                  onClick={handleTitleEdit}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Save"
                >
                  <span className="text-blue-500 text-sm">✓</span>
                </button>
                <button
                  onClick={() => {
                    setTitleText(column.title);
                    setIsEditingTitle(false);
                  }}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Cancel"
                >
                  <span className="text-red-500 text-sm">✕</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Edit title"
                >
                  <span>✏️</span>
                </button>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {tasks.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteColumn(column.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  ×
                </Button>
              </>
            )}
          </div>
        </div>

        {tasks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectAllInColumn(column.id)}
            className={`w-full justify-start cursor-pointer ${
              allSelected ? "text-blue-600" : "text-gray-600"
            }`}
          >
            ✅ {allSelected ? "Deselect All" : "Select All"} ({selectedInColumn}
            /{tasks.length})
          </Button>
        )}
      </div>

      <div className="p-4 bg-white border-b border-gray-200">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1 text-sm"
          />
          <Button type="submit" size="sm" disabled={!newTaskText.trim()}>
            Add
          </Button>
        </form>
      </div>

      <div
        className="flex-1 p-4 space-y-3 overflow-y-auto"
        data-testid="tasks-container"
      >
        {tasks.length === 0 ? (
          <div
            ref={emptyDropRef}
            className="text-center py-8 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="empty-column-drop-zone"
          >
            <div className="text-4xl mb-3 text-gray-300">📋</div>
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs text-gray-400 mt-2">Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task, taskIndex) => (
            <TaskItem key={task.id} task={task} index={taskIndex} />
          ))
        )}
      </div>
    </div>
  );
}
