import { HOUR_WIDTH, START, TOTAL_HOURS } from "./constants";
import type { ResourceId, Task } from "./types";
import type { TimeSlot } from "./types";

function getTasksForResource(tasks: Task[], resourceId: ResourceId) {
  return tasks.filter((task) => task.resourceId === resourceId);
}

function getBusyTimeSlotsForDay(
  tasks: Task[],
  resourceId: ResourceId,
  dayStartMs: number,
  dayEndMs: number,
) {
  return getTasksForResource(tasks, resourceId)
    .filter(
      (task) => task.endTimeMs > dayStartMs && task.startTimeMs < dayEndMs,
    )
    .map((task) => ({
      startMs: Math.max(task.startTimeMs, dayStartMs),
      endMs: Math.min(task.endTimeMs, dayEndMs),
    }))
    .sort((a, b) => a.startMs - b.startMs);
}

function mergeTimeSlots(slots: TimeSlot[]) {
  const mergedSlots: TimeSlot[] = [];
  slots.forEach((slot) => {
    const lastSlot = mergedSlots[mergedSlots.length - 1];
    if (!lastSlot || slot.startMs > lastSlot.endMs) {
      mergedSlots.push({ ...slot });
      return;
    }
    lastSlot.endMs = Math.max(lastSlot.endMs, slot.endMs);
  });
  return mergedSlots;
}

export function findAvailableTimeSlots(
  tasks: Task[],
  resourceId: ResourceId,
  dayStartMs: number,
  dayEndMs: number,
) {
  const busySlots = getBusyTimeSlotsForDay(
    tasks,
    resourceId,
    dayStartMs,
    dayEndMs,
  );
  const mergedBusySlots = mergeTimeSlots(busySlots);

  const availableSlots: TimeSlot[] = [];
  let cursor = dayStartMs;
  mergedBusySlots.forEach((slot) => {
    if (slot.startMs > cursor) {
      availableSlots.push({ startMs: cursor, endMs: slot.startMs });
    }
    cursor = Math.max(cursor, slot.endMs);
  });

  if (cursor < dayEndMs) {
    availableSlots.push({ startMs: cursor, endMs: dayEndMs });
  }

  return availableSlots;
}

export function hasTimeConflict(tasks: Task[], candidate: Task) {
  const resourceTasks = getTasksForResource(tasks, candidate.resourceId);
  return resourceTasks.some(
    (task) =>
      candidate.startTimeMs < task.endTimeMs &&
      candidate.endTimeMs > task.startTimeMs,
  );
}

export function msToOffset(ms: number) {
  return ((ms - START) / (1000 * 60 * 60)) * HOUR_WIDTH;
}

export function formatTime(ms: number) {
  const d = new Date(ms);
  const day = d.toUTCString().slice(0, 11);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${day} ${hh}:${mm}`;
}

export function buildHourLabels() {
  const labels: { hour: number; label: string }[] = [];
  for (let h = 0; h < TOTAL_HOURS; h++) {
    if (h % 2 === 0) {
      const date = new Date(START + h * 3600 * 1000);
      const hh = date.getUTCHours();
      labels.push({ hour: h, label: `${String(hh).padStart(2, "0")}:00` });
    }
  }
  return labels;
}
