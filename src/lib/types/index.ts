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
