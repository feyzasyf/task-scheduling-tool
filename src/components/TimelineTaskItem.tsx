import { memo } from "react";
import type { TaskId } from "../lib/types";
import { useAppState } from "../context/useAppState";
import TaskBar from "./TaskBar";

function TimelineTaskItemComponent({ taskId }: { taskId: TaskId }) {
  //each task subscribes to its own data, so that when a task updates, only that task re-renders
  const { tasksById, projectsById, selectedCategory } = useAppState();
  const task = tasksById[taskId];
  if (!task) return null;

  return (
    <TaskBar
      task={task}
      projectName={projectsById[task.projectId]?.name || task.projectId}
      dimmed={selectedCategory !== "All" && task.category !== selectedCategory}
    />
  );
}

const TimelineTaskItem = memo(TimelineTaskItemComponent);
export default TimelineTaskItem;
