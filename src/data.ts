//We expect a flattened response from backend in this shape:
// {
//   tasks: Task[],
//   resources: Resource[],
//   projects: Project[]
// }
// const { tasks, resources, projects } = await fetchTimelineData();

// const projectMap = Object.fromEntries(
//   projects.map(p => [p.id, p.name])
// );

type TaskId = `task_${string}`;
type ProjectId = `proj_${string}`;
type ResourceId = `res_${string}`;

export type Category = "Engineering" | "Operations" | "Commissioning";
export type TaskStatus = "planned" | "running" | "completed" | "cancelled";

export interface Task {
  id: TaskId;
  projectId: ProjectId;
  resourceId: ResourceId;
  title: string;
  description?: string;
  category: Category;

  startTimeMs: number;
  endTimeMs: number;

  status: TaskStatus;
  priority: "low" | "medium" | "high";

  metadata: {
    createdAt: number;
    updatedBy: string;
  };
}

export interface Resource {
  id: ResourceId;
  name: string;
  type: "telescope" | "antenna" | "receiver";
  capabilities: Category[]; // Can this resource handle Engineering tasks?
}

export type Project = {
  id: ProjectId;
  name: string;
  color?: string;
};
// April 13–17 2026 tasks (UNIX ms)
const d = (dateStr: string) => new Date(dateStr).getTime();

export const resources: Resource[] = [
  {
    id: "res_1",
    name: "Telescope Alpha",
    type: "telescope",
    capabilities: ["Engineering", "Operations"],
  },
];

/* -------------------- PROJECTS -------------------- */

export const projects: Project[] = [
  { id: "proj_1", name: "Exoplanet Survey", color: "#22c55e" },
  { id: "proj_2", name: "Pulsar Timing", color: "#3b82f6" },
  { id: "proj_3", name: "Maintenance Ops", color: "#f59e0b" },
  { id: "proj_4", name: "Calibration Run", color: "#a855f7" },
];

/* -------------------- TASKS -------------------- */

export const tasks: Task[] = [
  {
    id: "task_1",
    projectId: "proj_1",
    title: "Exoplanet Survey Prep",
    description: "Prepare instruments for exoplanet transit observation.",
    category: "Engineering",
    startTimeMs: d("2026-04-13T20:00:00Z"),
    endTimeMs: d("2026-04-14T02:00:00Z"),
    resourceId: "res_1",
    status: "running",
    priority: "high",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
  {
    id: "task_2",
    projectId: "proj_2",
    title: "Pulsar Timing Array",
    description:
      "Monitor millisecond pulsars for gravitational wave background.",
    category: "Operations",
    startTimeMs: d("2026-04-13T14:00:00Z"),
    endTimeMs: d("2026-04-13T18:00:00Z"),
    resourceId: "res_3",
    status: "completed",
    priority: "medium",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
  {
    id: "task_3",
    projectId: "proj_3",
    title: "Dome Rotation Check",
    description: "Routine dome motor and track inspection.",
    category: "Operations",
    startTimeMs: d("2026-04-13T16:00:00Z"),
    endTimeMs: d("2026-04-13T17:30:00Z"),
    resourceId: "res_1",
    status: "completed",
    priority: "low",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
  {
    id: "task_4",
    projectId: "proj_4",
    title: "Spectral Calibration",
    description: "Flat-field and wavelength calibration for spectrograph.",
    category: "Commissioning",
    startTimeMs: d("2026-04-14T04:00:00Z"),
    endTimeMs: d("2026-04-14T07:00:00Z"),
    resourceId: "res_1",
    status: "planned",
    priority: "high",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
  {
    id: "task_5",
    projectId: "proj_1",
    title: "Target Acquisition",
    description: "Lock onto HD 209458 field.",
    category: "Engineering",
    startTimeMs: d("2026-04-14T22:00:00Z"),
    endTimeMs: d("2026-04-15T03:00:00Z"),
    resourceId: "res_1",
    status: "planned",
    priority: "high",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
  {
    id: "task_6",
    projectId: "proj_2",
    title: "VLBI Sync Session",
    description: "Very Long Baseline Interferometry synchronisation.",
    category: "Engineering",
    startTimeMs: d("2026-04-15T08:00:00Z"),
    endTimeMs: d("2026-04-15T12:00:00Z"),
    resourceId: "res_2",
    status: "planned",
    priority: "medium",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
  {
    id: "task_7",
    projectId: "proj_3",
    title: "Receiver Cooldown",
    description: "Cool cryogenic receiver to operating temperature.",
    category: "Operations",
    startTimeMs: d("2026-04-15T18:00:00Z"),
    endTimeMs: d("2026-04-16T00:00:00Z"),
    resourceId: "res_2",
    status: "planned",
    priority: "medium",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
  {
    id: "task_8",
    projectId: "proj_4",
    title: "Pointing Model Update",
    description: "Update mount pointing model across 40 stars.",
    category: "Commissioning",
    startTimeMs: d("2026-04-16T20:00:00Z"),
    endTimeMs: d("2026-04-17T01:00:00Z"),
    resourceId: "res_1",
    status: "planned",
    priority: "low",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
  {
    id: "task_9",
    projectId: "proj_1",
    title: "Deep Field Imaging",
    description: "Long-exposure deep field imaging session.",
    category: "Engineering",
    startTimeMs: d("2026-04-17T21:00:00Z"),
    endTimeMs: d("2026-04-18T04:00:00Z"),
    resourceId: "res_1",
    status: "planned",
    priority: "high",
    metadata: {
      createdAt: d("2026-04-13T00:00:00Z"),
      updatedBy: "system",
    },
  },
];

export const CATEGORIES: Category[] = [
  "Engineering",
  "Operations",
  "Commissioning",
];

// Mapping specific categories to standard Tailwind utility classes
export const STATUS_COLORS: Record<string, string> = {
  planned: "bg-slate-500/10 text-slate-400",
  running: "bg-blue-500/10 text-blue-400",
  completed: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
};
export const CATEGORY_COLORS: Record<Category, string> = {
  Engineering: "bg-blue-600/10 text-blue-600",
  Commissioning: "bg-orange-500/10 text-orange-500",
  Operations: "bg-green-600/10 text-green-600",
};
