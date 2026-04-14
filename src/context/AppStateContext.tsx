import { useMemo, useState } from "react";
import { tasks as seedTasks } from "../data";
import type { Category, Task } from "../lib/types";
import {
  AppActionsContext,
  AppStateContext,
  type AppActions,
} from "./appStateStore";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const actions = useMemo<AppActions>(
    () => ({
      setSelectedCategory,
      openCreateTaskModal: () => setIsCreateTaskModalOpen(true),
      closeCreateTaskModal: () => setIsCreateTaskModalOpen(false),
      createTask: (task: Task) => {
        setTasks((current) => [...current, task]);
        setIsCreateTaskModalOpen(false);
      },
      deleteTask: (taskId: Task["id"]) => {
        setTasks((current) => current.filter((task) => task.id !== taskId));
      },
    }),
    [],
  );

  return (
    <AppStateContext.Provider
      value={{ tasks, selectedCategory, isCreateTaskModalOpen }}
    >
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}
