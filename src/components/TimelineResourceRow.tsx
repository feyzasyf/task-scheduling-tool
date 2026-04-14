import { memo, useMemo } from "react";
import { clsx } from "clsx";
import type { ResourceId } from "../lib/types";
import { HOUR_WIDTH, ROW_HEIGHT, TOTAL_HOURS } from "../lib/constants";
import { useAppState } from "../context/useAppState";
import TimelineTaskItem from "./TimelineTaskItem";

function TimelineResourceRowComponent({
  resourceId,
  rowIdx,
}: {
  resourceId: ResourceId;
  rowIdx: number;
}) {
  //each row subscribes to its own list of taskIds, so that when a task is added/removed from a resource, only that row re-renders
  const { taskIds, tasksById } = useAppState();
  const taskIdsForResource = useMemo(
    () =>
      taskIds.filter((taskId) => tasksById[taskId]?.resourceId === resourceId),
    [resourceId, taskIds, tasksById],
  );

  return (
    <div
      className={clsx(
        "relative border-b border-slate-800/50 transition-colors hover:bg-slate-800/20",
        rowIdx % 2 ? "bg-slate-900/40" : "bg-transparent",
      )}
      style={{ height: ROW_HEIGHT }}
    >
      {Array.from({ length: TOTAL_HOURS }).map((_, hour) => (
        <div
          key={hour}
          className="absolute top-0 bottom-0 border-l border-slate-800/30"
          style={{ left: hour * HOUR_WIDTH }}
        />
      ))}

      {taskIdsForResource.map((taskId) => (
        <TimelineTaskItem key={taskId} taskId={taskId} />
      ))}
    </div>
  );
}

const TimelineResourceRow = memo(TimelineResourceRowComponent);
export default TimelineResourceRow;
