import { useRef } from "react";
import NowBar from "./NowBar";
import ResourceSidebar from "./ResourceSidebar";
import TimelineTaskRows from "./TimelineTaskRows";
import useTimelineData from "../hooks/useTimelineData";
import { useAppState } from "../context/useAppState";
import {
  HEADER_HEIGHT,
  HOUR_WIDTH,
  DATE_HEADER_HEIGHT,
  TOTAL_HOURS,
} from "../lib/constants";
import { buildHourLabels } from "../lib/utils";

export default function Timeline() {
  const { taskIds, tasksById, resourceIds, resourcesById, selectedCategory } =
    useAppState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const hourLabels = buildHourLabels();
  const totalWidth = TOTAL_HOURS * HOUR_WIDTH;
  const { taskIdsByResource } = useTimelineData({
    taskIds,
    tasksById,
  });

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950">
      <ResourceSidebar
        resourceIds={resourceIds}
        resourcesById={resourcesById}
        taskIdsByResource={taskIdsByResource}
        tasksById={tasksById}
        selectedCategory={selectedCategory}
      />

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

          <TimelineTaskRows resourceIds={resourceIds} />

          <NowBar
            resourceCount={resourceIds.length}
            scrollContainer={scrollRef}
          />
        </div>
      </div>
    </div>
  );
}
