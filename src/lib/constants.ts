export const HOUR_WIDTH = 80;
export const ROW_HEIGHT = 72;
export const SIDEBAR_WIDTH = 220;
export const HEADER_HEIGHT = 36;
export const DATE_HEADER_HEIGHT = 28;

export const START = new Date("2026-04-13T00:00:00Z").getTime(); //UNIX timestamps in milliseconds
export const END = new Date("2026-04-18T00:00:00Z").getTime(); //UNIX timestamps in milliseconds
export const TOTAL_HOURS = (END - START) / (1000 * 60 * 60);

export function msToOffset(ms: number) {
  return ((ms - START) / (1000 * 60 * 60)) * HOUR_WIDTH;
}

const now = new Date("2026-04-13T21:00:00Z").getTime();
export const nowX = msToOffset(now);
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
