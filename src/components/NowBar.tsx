import { useEffect } from "react";
import {
  DATE_HEADER_HEIGHT,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  nowX,
} from "../lib/constants";

export default function NowBar({
  resourceCount,
  scrollContainer,
}: {
  resourceCount: number;
  scrollContainer: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    if (!scrollContainer.current) return;
    const container = scrollContainer.current;
    requestAnimationFrame(() => {
      container.scrollLeft = Math.max(0, nowX - container.clientWidth / 2);
    });
  }, [scrollContainer]);

  return (
    <div
      className="absolute top-0 pointer-events-none z-30 w-px bg-red-500"
      style={{
        left: nowX,
        height: resourceCount * ROW_HEIGHT + DATE_HEADER_HEIGHT + HEADER_HEIGHT,
      }}
    >
      <div className="absolute top-0 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-b shadow-sm">
        NOW
      </div>
    </div>
  );
}
