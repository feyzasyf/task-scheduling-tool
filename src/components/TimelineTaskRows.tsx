import { memo } from "react";
import type { ResourceId } from "../lib/types";
import TimelineResourceRow from "./TimelineResourceRow";

function TimelineTaskRowsComponent({
  resourceIds,
}: {
  resourceIds: ResourceId[];
}) {
  return (
    <>
      {resourceIds.map((resourceId, rowIdx) => (
        <TimelineResourceRow
          key={resourceId}
          resourceId={resourceId}
          rowIdx={rowIdx}
        />
      ))}
    </>
  );
}

const TimelineTaskRows = memo(TimelineTaskRowsComponent);
export default TimelineTaskRows;
