import { createContext } from "react";
import type { Category, Task } from "../lib/types";

export type AppState = {
  tasks: Task[];
  selectedCategory: Category | "All";
  isCreateTaskModalOpen: boolean;
};

export type AppActions = {
  setSelectedCategory: (category: Category | "All") => void;
  openCreateTaskModal: () => void;
  closeCreateTaskModal: () => void;
  createTask: (task: Task) => void;
  deleteTask: (taskId: Task["id"]) => void;
};

export const AppStateContext = createContext<AppState | undefined>(undefined);
export const AppActionsContext = createContext<AppActions | undefined>(undefined);
