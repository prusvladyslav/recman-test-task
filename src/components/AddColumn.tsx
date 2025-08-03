import type React from "react";

import { useState } from "react";
import { useTodoStore } from "../store/todo-store";
import { Button } from "./Button";
import { Input } from "./Input";

export function AddColumn() {
  const { addColumn } = useTodoStore();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addColumn(title.trim());
      setTitle("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <div className="w-80 min-w-80 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Column title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="w-full"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!title.trim()}>
              Add Column
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsAdding(true)}
      className="w-80 min-w-80 h-32 border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 flex flex-col items-center justify-center gap-2"
    >
      Add Column
    </Button>
  );
}
