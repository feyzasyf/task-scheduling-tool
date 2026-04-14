import type { Category, TaskStatus } from "./types";
import { msToOffset } from "./utils";

export const HOUR_WIDTH = 80;
export const ROW_HEIGHT = 72;
export const SIDEBAR_WIDTH = 220;
export const HEADER_HEIGHT = 36;
export const DATE_HEADER_HEIGHT = 28;

export const STATUS_COLORS: Record<TaskStatus, string> = {
  planned: "bg-emerald-500/10 text-emerald-400",
  running: "bg-blue-500/10 text-blue-400",
  completed: "bg-slate-500/10 text-slate-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Engineering: "bg-blue-600/10 text-blue-600",
  Commissioning: "bg-orange-500/10 text-orange-500",
  Operations: "bg-green-600/10 text-green-600",
};

export const START = new Date("2026-04-13T00:00:00Z").getTime(); //UNIX timestamps in milliseconds
export const END = new Date("2026-04-18T00:00:00Z").getTime(); //UNIX timestamps in milliseconds
export const TOTAL_HOURS = (END - START) / (1000 * 60 * 60);

const now = new Date("2026-04-13T21:00:00Z").getTime();

export const nowX = msToOffset(now);
