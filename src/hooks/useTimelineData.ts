import { useMemo } from "react";
import type { Task } from "../lib/types";
import { projects } from "../data";

export default function useTimelineData(tasks: Task[]) {
  const projectMap = useMemo(() => {
    const map: Record<string, string> = {};
    projects.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, []);

  const tasksByResource = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      if (!map[task.resourceId]) map[task.resourceId] = [];
      map[task.resourceId].push(task);
    });
    return map;
  }, [tasks]);
  return { projectMap, tasksByResource };
}
