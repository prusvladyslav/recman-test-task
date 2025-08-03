import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export type FilterType = "all" | "completed" | "incomplete" | "active";

interface TodoStore {
  columns: Column[];
  tasks: Task[];
  selectedTasks: Set<string>;
  searchQuery: string;
  filter: FilterType;
  editingTask: string | null;

  // Column operations
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  updateColumnTitle: (columnId: string, title: string) => void;
  reorderColumns: (startIndex: number, endIndex: number) => void;

  // Task operations
  addTask: (text: string, columnId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, text: string) => void;
  toggleTask: (taskId: string) => void;
  moveTask: (taskId: string, newColumnId: string, newIndex?: number) => void;
  reorderTasks: (
    columnId: string,
    startIndex: number,
    endIndex: number
  ) => void;

  // Selection operations
  toggleTaskSelection: (taskId: string) => void;
  selectAllInColumn: (columnId: string) => void;
  clearSelection: () => void;
  bulkDelete: () => void;
  bulkToggleComplete: (completed: boolean) => void;
  bulkMoveToColumn: (columnId: string) => void;

  // UI state
  setSearchQuery: (query: string) => void;
  setFilter: (filter: FilterType) => void;
  setEditingTask: (taskId: string | null) => void;

  // Getters
  getTasksByColumn: (columnId: string) => Task[];
  getFilteredTasks: (columnId: string) => Task[];
  getStats: () => {
    total: number;
    completed: number;
    incomplete: number;
    active: number;
  };
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      columns: [
        { id: "todo", title: "To Do", order: 0 },
        { id: "in-progress", title: "In Progress", order: 1 },
        { id: "done", title: "Done", order: 2 },
      ],
      tasks: [],
      selectedTasks: new Set(),
      searchQuery: "",
      filter: "all",
      editingTask: null,

      // Column operations
      addColumn: (title: string) => {
        const newColumn: Column = {
          id: crypto.randomUUID(),
          title,
          order: get().columns.length,
        };
        set((state) => ({ columns: [...state.columns, newColumn] }));
      },

      deleteColumn: (columnId: string) => {
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== columnId),
          tasks: state.tasks.filter((task) => task.columnId !== columnId),
          selectedTasks: new Set(
            [...state.selectedTasks].filter(
              (id) =>
                state.tasks.find((task) => task.id === id)?.columnId !==
                columnId
            )
          ),
        }));
      },

      updateColumnTitle: (columnId: string, title: string) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, title } : col
          ),
        }));
      },

      reorderColumns: (startIndex: number, endIndex: number) => {
        set((state) => {
          const result = Array.from(
            state.columns.sort((a, b) => a.order - b.order)
          );
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            columns: result.map((col, index) => ({ ...col, order: index })),
          };
        });
      },

      // Task operations
      addTask: (text: string, columnId: string) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          text: text.trim(),
          completed: false,
          createdAt: new Date(),
          columnId,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      deleteTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          selectedTasks: new Set(
            [...state.selectedTasks].filter((id) => id !== taskId)
          ),
        }));
      },

      updateTask: (taskId: string, text: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, text } : task
          ),
        }));
      },

      toggleTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        }));
      },

      moveTask: (taskId: string, newColumnId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, columnId: newColumnId } : task
          ),
        }));
      },

      reorderTasks: (
        columnId: string,
        startIndex: number,
        endIndex: number
      ) => {
        set((state) => {
          const columnTasks = get().getTasksByColumn(columnId);
          const otherTasks = state.tasks.filter(
            (task) => task.columnId !== columnId
          );
          const result = Array.from(columnTasks);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { tasks: [...otherTasks, ...result] };
        });
      },

      // Selection operations
      toggleTaskSelection: (taskId: string) => {
        set((state) => {
          const newSelection = new Set(state.selectedTasks);
          if (newSelection.has(taskId)) {
            newSelection.delete(taskId);
          } else {
            newSelection.add(taskId);
          }
          return { selectedTasks: newSelection };
        });
      },

      selectAllInColumn: (columnId: string) => {
        set((state) => {
          const columnTasks = get().getFilteredTasks(columnId);
          const newSelection = new Set(state.selectedTasks);
          const allSelected = columnTasks.every((task) =>
            newSelection.has(task.id)
          );

          if (allSelected) {
            columnTasks.forEach((task) => newSelection.delete(task.id));
          } else {
            columnTasks.forEach((task) => newSelection.add(task.id));
          }

          return { selectedTasks: newSelection };
        });
      },

      clearSelection: () => {
        set({ selectedTasks: new Set() });
      },

      bulkDelete: () => {
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => !state.selectedTasks.has(task.id)
          ),
          selectedTasks: new Set(),
        }));
      },

      bulkToggleComplete: (completed: boolean) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            state.selectedTasks.has(task.id) ? { ...task, completed } : task
          ),
          selectedTasks: new Set(),
        }));
      },

      bulkMoveToColumn: (columnId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            state.selectedTasks.has(task.id) ? { ...task, columnId } : task
          ),
          selectedTasks: new Set(),
        }));
      },

      // UI state
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setFilter: (filter: FilterType) => {
        set({ filter });
      },

      setEditingTask: (taskId: string | null) => {
        set({ editingTask: taskId });
      },

      // Getters
      getTasksByColumn: (columnId: string) => {
        return get().tasks.filter((task) => task.columnId === columnId);
      },

      getFilteredTasks: (columnId: string) => {
        const { tasks, searchQuery, filter } = get();
        let filteredTasks = tasks.filter((task) => task.columnId === columnId);

        if (searchQuery) {
          filteredTasks = filteredTasks.filter((task) =>
            task.text.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (filter === "completed") {
          filteredTasks = filteredTasks.filter((task) => task.completed);
        } else if (filter === "incomplete") {
          filteredTasks = filteredTasks.filter((task) => !task.completed);
        }

        return filteredTasks;
      },

      getStats: () => {
        const { tasks } = get();
        const completed = tasks.filter((task) => task.completed).length;
        const incomplete = tasks.filter((task) => !task.completed).length;
        return {
          total: tasks.length,
          completed,
          incomplete,
          active: incomplete,
        };
      },
    }),
    {
      name: "kanban-todo-storage",
      partialize: (state) => ({
        columns: state.columns,
        tasks: state.tasks,
      }),
    }
  )
);

export type Todo = Task;
