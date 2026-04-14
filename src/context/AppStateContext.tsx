import { useMemo, useState } from "react";
import {
  projects as seedProjects,
  resources as seedResources,
  tasks as seedTasks,
} from "../data";
import type {
  Category,
  Project,
  ProjectId,
  Resource,
  ResourceId,
  Task,
  TaskId,
} from "../lib/types";
import {
  AppActionsContext,
  AppStateContext,
  type AppActions,
} from "./appStateStore";

//----------convert arrays to maps for fast lookup  start---------//
function toTaskState(tasks: Task[]) {
  const tasksById = {} as Record<TaskId, Task>;
  const taskIds: TaskId[] = [];
  tasks.forEach((task) => {
    tasksById[task.id] = task;
    taskIds.push(task.id);
  });
  return { tasksById, taskIds };
}

function toResourceState(resources: Resource[]) {
  const resourcesById = {} as Record<ResourceId, Resource>;
  const resourceIds: ResourceId[] = [];
  resources.forEach((resource) => {
    resourcesById[resource.id] = resource;
    resourceIds.push(resource.id);
  });
  return { resourcesById, resourceIds };
}

function toProjectState(projects: Project[]) {
  const projectsById = {} as Record<ProjectId, Project>;
  const projectIds: ProjectId[] = [];
  projects.forEach((project) => {
    projectsById[project.id] = project;
    projectIds.push(project.id);
  });
  return { projectsById, projectIds };
}
//----------convert arrays to maps for fast lookup  end---------//

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [taskState, setTaskState] = useState(() => toTaskState(seedTasks));
  const [resourceState] = useState(() => toResourceState(seedResources));
  const [projectState] = useState(() => toProjectState(seedProjects));
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All",
  );
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const actions = useMemo<AppActions>(
    () => ({
      setSelectedCategory,
      openCreateTaskModal: () => setIsCreateTaskModalOpen(true),
      closeCreateTaskModal: () => setIsCreateTaskModalOpen(false),
      replaceTasks: (tasks: Task[]) => {
        setTaskState(toTaskState(tasks));
      },
      createTask: (task: Task) => {
        setTaskState((current) => ({
          tasksById: { ...current.tasksById, [task.id]: task },
          taskIds: [...current.taskIds, task.id],
        }));
        setIsCreateTaskModalOpen(false);
      },
      deleteTask: (taskId: TaskId) => {
        setTaskState((current) => {
          const nextTasksById = { ...current.tasksById };
          delete nextTasksById[taskId];
          return {
            tasksById: nextTasksById,
            taskIds: current.taskIds.filter((id) => id !== taskId),
          };
        });
      },
    }),
    [],
  );

  return (
    <AppStateContext.Provider
      value={{
        ...taskState,
        ...resourceState,
        ...projectState,
        selectedCategory,
        isCreateTaskModalOpen,
      }}
    >
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}
