import { memo } from "react";
import type { Category, Resource, ResourceId, Task, TaskId } from "../lib/types";
import { DATE_HEADER_HEIGHT, HEADER_HEIGHT, ROW_HEIGHT, SIDEBAR_WIDTH } from "../lib/constants";

function ResourceSidebarComponent({
  resourceIds,
  resourcesById,
  taskIdsByResource,
  tasksById,
  selectedCategory,
}: {
  resourceIds: ResourceId[];
  resourcesById: Record<ResourceId, Resource>;
  taskIdsByResource: Record<ResourceId, TaskId[]>;
  tasksById: Record<TaskId, Task>;
  selectedCategory: Category | "All";
}) {
  return (
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

      {resourceIds.map((resourceId) => {
        const resource = resourcesById[resourceId];
        if (!resource) return null;
        const taskIds = taskIdsByResource[resource.id] || [];
        const categoryCount =
          selectedCategory === "All"
            ? taskIds.length
            : taskIds.filter(
                (taskId) => tasksById[taskId]?.category === selectedCategory,
              ).length;

        return (
          <div
            key={resource.id}
            className="px-4 border-b border-slate-800/50 flex flex-col justify-center bg-slate-900"
            style={{ height: ROW_HEIGHT }}
          >
            <span className="text-sm font-medium text-slate-300">{resource.name}</span>
            <span className="mt-1 text-[11px] text-slate-500">
              {selectedCategory === "All"
                ? `All Categories - ${categoryCount} tasks`
                : `${selectedCategory} - ${categoryCount} tasks`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const ResourceSidebar = memo(ResourceSidebarComponent);
export default ResourceSidebar;
