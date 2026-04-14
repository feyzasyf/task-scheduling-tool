import { createContext } from "react";
import type {
  Category,
  Project,
  ProjectId,
  Resource,
  ResourceId,
  Task,
  TaskId,
} from "../lib/types";

export type AppState = {
  tasksById: Record<TaskId, Task>;
  taskIds: TaskId[];
  resourcesById: Record<ResourceId, Resource>;
  resourceIds: ResourceId[];
  projectsById: Record<ProjectId, Project>;
  projectIds: ProjectId[];
  selectedCategory: Category | "All";
  isCreateTaskModalOpen: boolean;
};

export type AppActions = {
  setSelectedCategory: (category: Category | "All") => void;
  openCreateTaskModal: () => void;
  closeCreateTaskModal: () => void;
  replaceTasks: (tasks: Task[]) => void;
  createTask: (task: Task) => void;
  deleteTask: (taskId: TaskId) => void;
};

export const AppStateContext = createContext<AppState | undefined>(undefined);
export const AppActionsContext = createContext<AppActions | undefined>(undefined);
