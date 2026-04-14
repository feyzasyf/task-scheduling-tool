import type { Task } from "../lib/types";
import { CATEGORY_COLORS, STATUS_COLORS } from "../data";

export default function Tooltip({
  task,
  formatTime,
  title,
}: {
  task: Task;
  title: string;
  formatTime: (ms: number) => string;
}) {
  const statusClasses =
    STATUS_COLORS[task.status] || "bg-slate-700/20 text-slate-400";
  const categoryClasses =
    CATEGORY_COLORS[task.category] || "bg-slate-700/20 text-slate-400";

  return (
    <div className="absolute top-full left-0 mt-2 z-50 pointer-events-none min-w-56">
      <div className="rounded-lg p-3 text-xs shadow-2xl bg-slate-900 border border-slate-700 text-slate-300">
        {/* Title */}
        <div className="text-sm font-semibold mb-2 leading-tight text-slate-50">
          {task.title}
        </div>

        {/* Badges */}
        <div className="flex gap-1 mb-3 flex-wrap">
          <span
            className={`px-1.5 py-0.5 rounded font-bold text-xs ${statusClasses}`}
          >
            {task.status}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded font-bold text-xs ${categoryClasses}`}
          >
            {task.category}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <section>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Project
            </div>
            <div className="text-slate-200">{title}</div>
          </section>

          <div className="grid grid-cols-2 gap-2">
            <section>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Start
              </div>
              <div className="text-slate-200">
                {formatTime(task.startTimeMs)}
              </div>
            </section>
            <section>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                End
              </div>
              <div className="text-slate-200">{formatTime(task.endTimeMs)}</div>
            </section>
          </div>

          <section>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Duration
            </div>
            <div className="text-slate-200">
              {Math.round((task.endTimeMs - task.startTimeMs) / (1000 * 60))}{" "}
              min
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
