import { useRef, useEffect } from "react";
import { clsx } from "clsx";
import { resources } from "../data";
import type { Task } from "../lib/types";
import TaskBar from "./TaskBar";
import useTimelineData from "../hooks/useTimelineData";
import {
  DATE_HEADER_HEIGHT,
  HEADER_HEIGHT,
  HOUR_WIDTH,
  ROW_HEIGHT,
  SIDEBAR_WIDTH,
  TOTAL_HOURS,
  buildHourLabels,
  nowX,
} from "../lib/constants";

export default function Timeline({
  tasks,
  onDeleteTask,
}: {
  tasks: Task[];
  onDeleteTask: (taskId: Task["id"]) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hourLabels = buildHourLabels();
  const totalWidth = TOTAL_HOURS * HOUR_WIDTH;
  const { tasksByResource, projectMap } = useTimelineData(tasks);

  // Scroll to "now" on mount
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    requestAnimationFrame(() => {
      container.scrollLeft = Math.max(0, nowX - container.clientWidth / 2);
    });
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <div
        className="shrink-0 border-r border-slate-800 overflow-y-auto bg-slate-900"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div
          className="sticky top-0 z-20 flex items-center px-4 border-b border-slate-800 bg-slate-900"
          style={{ height: DATE_HEADER_HEIGHT + HEADER_HEIGHT }}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Resources
          </span>
        </div>

        {resources.map((res) => (
          <div
            key={res.id}
            className="px-4 border-b border-slate-800/50 flex items-center bg-slate-900"
            style={{ height: ROW_HEIGHT }}
          >
            <span className="text-sm font-medium text-slate-300">
              {res.name}
            </span>
          </div>
        ))}
      </div>

      {/* Scroll area */}
      <div ref={scrollRef} className="flex-1 overflow-auto scrollbar-hide">
        <div className="relative" style={{ width: totalWidth }}>
          {/* Header */}
          <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm">
            {/* Days Header */}
            <div
              className="flex border-b border-slate-800"
              style={{ height: DATE_HEADER_HEIGHT }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="border-r border-slate-800 px-3 text-[10px] font-bold text-slate-500 flex items-center uppercase"
                  style={{ width: 24 * HOUR_WIDTH }}
                >
                  Day {i + 1}
                </div>
              ))}
            </div>

            {/* Hours Header */}
            <div
              className="relative border-b border-slate-800"
              style={{ height: HEADER_HEIGHT }}
            >
              {hourLabels.map(({ hour, label }) => (
                <div
                  key={hour}
                  className="absolute text-[10px] text-slate-600 font-mono"
                  style={{ left: hour * HOUR_WIDTH + 4, top: 10 }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {resources.map((res, rowIdx) => (
            <div
              key={res.id}
              className={clsx(
                "relative border-b border-slate-800/50 transition-colors hover:bg-slate-800/20",
                rowIdx % 2 ? "bg-slate-900/40" : "bg-transparent",
              )}
              style={{ height: ROW_HEIGHT }}
            >
              {/* Vertical Hour Grid Lines */}
              {Array.from({ length: TOTAL_HOURS }).map((_, h) => (
                <div
                  key={h}
                  className="absolute top-0 bottom-0 border-l border-slate-800/30"
                  style={{ left: h * HOUR_WIDTH }}
                />
              ))}

              {/* Tasks */}
              {(tasksByResource[res.id] || []).map((task) => (
                <TaskBar
                  key={task.id}
                  task={task}
                  projectName={projectMap[task.projectId] || task.projectId}
                  onDeleteTask={onDeleteTask}
                />
              ))}
            </div>
          ))}

          {/* Now line */}
          <div
            className="absolute top-0 pointer-events-none z-30 w-px bg-red-500"
            style={{
              left: nowX,
              height:
                resources.length * ROW_HEIGHT +
                DATE_HEADER_HEIGHT +
                HEADER_HEIGHT,
            }}
          >
            <div className="absolute top-0 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-b shadow-sm">
              NOW
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
