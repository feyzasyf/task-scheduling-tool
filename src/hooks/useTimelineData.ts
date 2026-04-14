import { useMemo } from "react";
import type { ResourceId, Task, TaskId } from "../lib/types";

export default function useTimelineData({
  taskIds,
  tasksById,
}: {
  taskIds: TaskId[];
  tasksById: Record<TaskId, Task>;
}) {
  const taskIdsByResource = useMemo(() => {
    const map: Record<ResourceId, TaskId[]> = {} as Record<ResourceId, TaskId[]>;
    taskIds.forEach((taskId) => {
      const task = tasksById[taskId];
      if (!task) return;
      if (!map[task.resourceId]) map[task.resourceId] = [];
      map[task.resourceId].push(task.id);
    });
    return map;
  }, [taskIds, tasksById]);
  return { taskIdsByResource };
}
