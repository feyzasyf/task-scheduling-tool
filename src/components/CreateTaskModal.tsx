import { useMemo, useState } from "react";
import { CATEGORIES } from "../data";
import type {
  Category,
  ProjectId,
  ResourceId,
  Task,
} from "../lib/types";
import { findAvailableTimeSlots, hasTimeConflict } from "../lib/utils";
import { useAppActions, useAppState } from "../context/useAppState";

type FormState = {
  title: string;
  startDate: string;
  startHour: string;
  startMinute: string;
  startMeridiem: "AM" | "PM";
  durationMinutes: string;
  category: Category;
  projectId: ProjectId | "";
  resourceId: ResourceId | "";
  description: string;
};

const INITIAL_FORM_STATE: FormState = {
  title: "",
  startDate: "2026-04-14",
  startHour: "09",
  startMinute: "00",
  startMeridiem: "AM",
  durationMinutes: "60",
  category: "Engineering",
  projectId: "",
  resourceId: "",
  description: "",
};

function parseDateAndTimeToUtcMs(
  dateValue: string,
  hourValue: string,
  minuteValue: string,
  meridiem: "AM" | "PM",
) {
  const isoDateMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const usDateMatch = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!isoDateMatch && !usDateMatch) return null;

  const year = Number(isoDateMatch ? isoDateMatch[1] : usDateMatch?.[3]);
  const month = Number(isoDateMatch ? isoDateMatch[2] : usDateMatch?.[1]);
  const day = Number(isoDateMatch ? isoDateMatch[3] : usDateMatch?.[2]);
  const hour12 = Number(hourValue);
  const minute = Number(minuteValue);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) return null;

  const hour24 = (hour12 % 12) + (meridiem === "PM" ? 12 : 0);
  const timestamp = Date.UTC(year, month - 1, day, hour24, minute, 0, 0);
  if (Number.isNaN(timestamp)) return null;
  return timestamp;
}

function parseDateToUtcDayRange(dateValue: string) {
  const isoDateMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const usDateMatch = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!isoDateMatch && !usDateMatch) return null;

  const year = Number(isoDateMatch ? isoDateMatch[1] : usDateMatch?.[3]);
  const month = Number(isoDateMatch ? isoDateMatch[2] : usDateMatch?.[1]);
  const day = Number(isoDateMatch ? isoDateMatch[3] : usDateMatch?.[2]);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const dayStartMs = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  if (Number.isNaN(dayStartMs)) return null;

  return { dayStartMs, dayEndMs: dayStartMs + 24 * 60 * 60 * 1000 };
}

function formatUtcTime(ms: number) {
  const date = new Date(ms);
  const rawHour = date.getUTCHours();
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  const meridiem = rawHour >= 12 ? "PM" : "AM";
  const hour12 = rawHour % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${minute} ${meridiem}`;
}

export default function CreateTaskModal() {
  const { taskIds, tasksById, projectIds, projectsById, resourceIds, resourcesById } =
    useAppState();
  const { createTask, closeCreateTaskModal } = useAppActions();
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [errorMessage, setErrorMessage] = useState("");
  const existingTasks = useMemo(
    () => taskIds.map((id) => tasksById[id]).filter((task): task is Task => Boolean(task)),
    [taskIds, tasksById],
  );

  const selectedResource = useMemo(
    () => (form.resourceId ? resourcesById[form.resourceId] : undefined),
    [form.resourceId, resourcesById],
  );
  const selectedDayRange = useMemo(
    () => parseDateToUtcDayRange(form.startDate),
    [form.startDate],
  );
  const availableSlots = useMemo(() => {
    if (!selectedDayRange || !form.resourceId) return [];
    return findAvailableTimeSlots(
      existingTasks,
      form.resourceId,
      selectedDayRange.dayStartMs,
      selectedDayRange.dayEndMs,
    );
  }, [existingTasks, form.resourceId, selectedDayRange]);

  const updateFormValue = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrorMessage("");
  };

  const applySlotStartToForm = (startMs: number) => {
    const date = new Date(startMs);
    const utcHour = date.getUTCHours();
    const minute = String(date.getUTCMinutes()).padStart(2, "0");
    const meridiem: "AM" | "PM" = utcHour >= 12 ? "PM" : "AM";
    const hour12 = utcHour % 12 || 12;

    setForm((current) => ({
      ...current,
      startHour: String(hour12).padStart(2, "0"),
      startMinute: minute,
      startMeridiem: meridiem,
    }));
    setErrorMessage("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setErrorMessage("Task title is required.");
      return;
    }
    if (!form.projectId) {
      setErrorMessage("Please select a project.");
      return;
    }
    if (!form.resourceId) {
      setErrorMessage("Please select a resource.");
      return;
    }

    const projectId = form.projectId;
    const resourceId = form.resourceId;

    const startTimeMs = parseDateAndTimeToUtcMs(
      form.startDate,
      form.startHour,
      form.startMinute,
      form.startMeridiem,
    );
    if (startTimeMs === null) {
      setErrorMessage("Please select a valid start date and time.");
      return;
    }

    const durationMinutes = Number(form.durationMinutes);
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      setErrorMessage("Duration must be a positive number of minutes.");
      return;
    }

    if (selectedResource && !selectedResource.capabilities.includes(form.category)) {
      setErrorMessage(
        `${selectedResource.name} does not support ${form.category} tasks.`,
      );
      return;
    }

    const newTask: Task = {
      id: `task_${Date.now()}`,
      projectId,
      resourceId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      startTimeMs,
      endTimeMs: startTimeMs + durationMinutes * 60 * 1000,
      status: "planned",
      priority: "medium",
      metadata: {
        createdAt: Date.now(),
        updatedBy: "user",
      },
    };

    if (hasTimeConflict(existingTasks, newTask)) {
      setErrorMessage(
        "This time slot is not available for the selected resource. Choose another time.",
      );
      return;
    }

    createTask(newTask);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-300 bg-slate-100 text-slate-900 shadow-2xl">
        <div className="border-b border-slate-300 px-5 py-3">
          <h2 className="text-xl font-semibold">Create Task</h2>
        </div>

        <form className="space-y-4 px-5 py-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="task-title" className="mb-1 block text-sm font-medium">
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(event) => updateFormValue("title", event.target.value)}
              placeholder="Enter task title"
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="duration" className="mb-1 block text-sm font-medium">
              Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              value={form.durationMinutes}
              min={1}
              onChange={(event) =>
                updateFormValue("durationMinutes", event.target.value)
              }
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(event) =>
                  updateFormValue("category", event.target.value as Category)
                }
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="project" className="mb-1 block text-sm font-medium">
                Project
              </label>
              <select
                id="project"
                value={form.projectId}
                onChange={(event) =>
                  updateFormValue(
                    "projectId",
                    event.target.value as FormState["projectId"],
                  )
                }
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-500 outline-none focus:border-blue-500"
              >
                <option value="" disabled>
                  Select a project
                </option>
                {projectIds.map((projectId) => {
                  const project = projectsById[projectId];
                  if (!project) return null;
                  return (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="resource" className="mb-1 block text-sm font-medium">
              Resource
            </label>
            <select
              id="resource"
              value={form.resourceId}
                onChange={(event) =>
                  updateFormValue(
                    "resourceId",
                    event.target.value as FormState["resourceId"],
                  )
                }
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-500 outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select a resource
              </option>
              {resourceIds.map((resourceId) => {
                const resource = resourcesById[resourceId];
                if (!resource) return null;
                return (
                  <option key={resource.id} value={resource.id}>
                    {resource.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start-date" className="mb-1 block text-sm font-medium">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  updateFormValue("startDate", event.target.value)
                }
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="start-time" className="mb-1 block text-sm font-medium">
                Start Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  id="start-time-hour"
                  value={form.startHour}
                  onChange={(event) =>
                    updateFormValue("startHour", event.target.value)
                  }
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-blue-500"
                >
                  {Array.from({ length: 12 }).map((_, index) => {
                    const hour = String(index + 1).padStart(2, "0");
                    return (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    );
                  })}
                </select>
                <select
                  id="start-time-minute"
                  value={form.startMinute}
                  onChange={(event) =>
                    updateFormValue("startMinute", event.target.value)
                  }
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-blue-500"
                >
                  {Array.from({ length: 60 }).map((_, index) => {
                    const minute = String(index).padStart(2, "0");
                    return (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    );
                  })}
                </select>
                <select
                  id="start-time-meridiem"
                  value={form.startMeridiem}
                  onChange={(event) =>
                    updateFormValue(
                      "startMeridiem",
                      event.target.value as "AM" | "PM",
                    )
                  }
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium">Available Time Slots</label>
              {selectedResource && (
                <span className="text-xs text-slate-500">{selectedResource.name}</span>
              )}
            </div>
            {!form.resourceId ? (
              <p className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-500">
                Select a resource to see empty time slots for this day.
              </p>
            ) : !selectedDayRange ? (
              <p className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-500">
                Select a valid start date to compute available slots.
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                No empty slots available for this resource on this date.
              </p>
            ) : (
              <div className="max-h-28 space-y-2 overflow-y-auto rounded-md border border-slate-300 bg-white p-2">
                {availableSlots.map((slot) => {
                  const durationMinutes = Math.round(
                    (slot.endMs - slot.startMs) / (1000 * 60),
                  );
                  return (
                    <button
                      key={`${slot.startMs}-${slot.endMs}`}
                      type="button"
                      onClick={() => applySlotStartToForm(slot.startMs)}
                      className="flex w-full items-center justify-between rounded-md border border-slate-200 px-2 py-1.5 text-left text-sm text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <span>
                        {formatUtcTime(slot.startMs)} - {formatUtcTime(slot.endMs)}
                      </span>
                      <span className="text-xs text-slate-500">{durationMinutes} min</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description"
              rows={4}
              value={form.description}
              onChange={(event) =>
                updateFormValue("description", event.target.value)
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>

          {errorMessage && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              className="h-9 rounded-md bg-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-300"
              onClick={closeCreateTaskModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 min-w-36 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
