import { useState, type FormEvent } from "react";
import { useTodoStore } from "../store/todo-store";
import { Input } from "./Input";
import { Button } from "./Button";

interface AddTodoProps {
  columnId: string;
}

export function AddTodo({ columnId }: AddTodoProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { addTask } = useTodoStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter a task");
      return;
    }

    if (text.trim().length > 200) {
      setError("Task is too long (max 200 characters)");
      return;
    }

    addTask(text, columnId);
    setText("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          error={!!error}
          className="flex-1"
          maxLength={200}
        />
        <Button type="submit" disabled={!text.trim()}>
          Add Task
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
