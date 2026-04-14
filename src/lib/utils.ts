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
