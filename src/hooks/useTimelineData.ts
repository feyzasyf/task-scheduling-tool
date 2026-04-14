import { useMemo } from "react";
import type { Project, ProjectId, ResourceId, Task, TaskId } from "../lib/types";

export default function useTimelineData({
  taskIds,
  tasksById,
  projectsById,
}: {
  taskIds: TaskId[];
  tasksById: Record<TaskId, Task>;
  projectsById: Record<ProjectId, Project>;
}) {
  const projectMap = useMemo(() => {
    const map: Record<ProjectId, string> = {} as Record<ProjectId, string>;
    Object.values(projectsById).forEach((project) => {
      map[project.id] = project.name;
    });
    return map;
  }, [projectsById]);

  const tasksByResource = useMemo(() => {
    const map: Record<ResourceId, Task[]> = {} as Record<ResourceId, Task[]>;
    taskIds.forEach((taskId) => {
      const task = tasksById[taskId];
      if (!task) return;
      if (!map[task.resourceId]) map[task.resourceId] = [];
      map[task.resourceId].push(task);
    });
    return map;
  }, [taskIds, tasksById]);
  return { projectMap, tasksByResource };
}
