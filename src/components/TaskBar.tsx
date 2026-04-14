import { useState } from "react";
import { clsx } from "clsx";
import {
  CATEGORY_COLORS,
  STATUS_COLORS,
  msToOffset,
  HOUR_WIDTH,
  formatTime,
} from "../lib/constants";
import type { Task } from "../lib/types";
import Tooltip from "./Tooltip";

export default function TaskBar({
  task,
  projectName,
  onDeleteTask,
}: {
  task: Task;
  projectName: string;
  onDeleteTask: (taskId: Task["id"]) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const x = msToOffset(task.startTimeMs);
  const width = Math.max(msToOffset(task.endTimeMs) - x, HOUR_WIDTH * 0.5);

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

      {hovered && (
        <button
          type="button"
          aria-label={`Delete ${task.title}`}
          onClick={(event) => {
            event.stopPropagation();
            if (window.confirm(`Delete task "${task.title}"?`)) {
              onDeleteTask(task.id);
            }
          }}
          className="h-5 w-5 shrink-0 rounded bg-slate-900/70 text-slate-300 hover:bg-red-600 hover:text-white"
        >
          x
        </button>
      )}

      {/* Tooltip */}
      {hovered && (
        <Tooltip task={task} formatTime={formatTime} title={projectName} />
      )}
    </div>
  );
}
