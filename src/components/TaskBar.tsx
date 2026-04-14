import { useState } from "react";
import { clsx } from "clsx";
import { tasks as allTasks, STATUS_COLORS, CATEGORY_COLORS } from "../data";
import { msToOffset, HOUR_WIDTH, formatTime } from "../lib/constants";
import type { Task } from "../data";
import useTimelineData from "../hooks/useTimelineData";
import Tooltip from "./Tooltip";

export default function TaskBar({ task }: { task: Task }) {
  const [hovered, setHovered] = useState(false);
  const x = msToOffset(task.startTimeMs);
  const width = Math.max(msToOffset(task.endTimeMs) - x, HOUR_WIDTH * 0.5);
  const { projectMap } = useTimelineData(allTasks);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ left: x, width }}
      className={clsx(
        "absolute top-2 bottom-2 flex items-center gap-2 px-2 rounded-md cursor-pointer",
        "border border-l-[3px] transition-all",
        STATUS_COLORS[task.status],
        hovered ? "z-40 ring-1 ring-white/20 shadow-lg" : "z-10",
      )}
    >
      <div
        className={clsx(
          "h-1.5 w-1.5 rounded-full shrink-0",
          CATEGORY_COLORS[task.category],
        )}
      />

      {/* Title */}
      <span className="text-xs font-medium flex-1 min-w-0 truncate text-slate-200">
        {task.title}
      </span>

      {/* Tooltip */}
      {hovered && (
        <Tooltip
          task={task}
          formatTime={formatTime}
          title={projectMap[task.projectId] || task.projectId}
        />
      )}
    </div>
  );
}
