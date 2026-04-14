# Task Scheduling Tool

A React + TypeScript scheduling UI for planning telescope/resource work on a timeline.

## Design

See design.md for the design of the solution: [Design Document](./design.md)

Figma file : [figma design](https://www.figma.com/design/dSavVH7uhoTITjJUEuQGVF/Task-scheduler?node-id=1-173&t=U5HOPH39eKvoMVkD-1)   
[beta-mode figma design play](https://www.figma.com/make/k6AAGWUpiL37Hdyh8t8bam/Task-Scheduling-Application?fullscreen=1&t=tERFvmo3WIdUjCvM-1)

## What It Does

- Displays tasks on a horizontal timeline grouped by resource.
- Supports category filtering (`All`, `Engineering`, `Commissioning`, `Operations`).
- Opens a Create Task modal with:
  - date picker
  - hour/minute/AM-PM selectors
  - project/resource selection
  - capability validation by resource
  - overlap detection for same-resource time conflicts
  - available time slot suggestions
- Allows deleting tasks directly from the timeline.

## Tech Stack

- `React 19`
- `TypeScript`
- `Vite`
- `Tailwind CSS`

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

Key files and folders:

- `src/App.tsx`  
  App shell and provider wiring.
- `src/context/AppStateContext.tsx`  
  Central app state and actions (Context + `useState`), including normalized maps.
- `src/context/appStateStore.ts` and `src/context/useAppState.ts`  
  Context types and hooks (`useAppState`, `useAppActions`).
- `src/components/Timeline.tsx`  
  Main timeline layout.
- `src/components/TimelineTaskRows.tsx`, `src/components/TimelineResourceRow.tsx`, `src/components/TimelineTaskItem.tsx`  
  Row/task rendering split for better re-render behavior.
- `src/components/CreateTaskModal.tsx`  
  Task creation form and validation.
- `src/components/NowBar.tsx`  
  Current-time indicator (fixed/only for demonstration purposes) and initial scroll centering.
- `src/lib/utils.ts`  
  Scheduling utilities (`findAvailableTimeSlots`, `hasTimeConflict`, etc.).
- `src/lib/types/index.ts`  
  Shared domain types.
- `src/lib/constants.ts`  
  UI/timeline constants and category/status colors.
- `src/data.ts`  
  Seed resources, projects, and tasks.

## State Model

The app keeps normalized data in context for fast lookup/update:

- `tasksById` + `taskIds`
- `resourcesById` + `resourceIds`
- `projectsById` + `projectIds`

Actions include:

- `createTask`
- `deleteTask`
- `replaceTasks`
- `setSelectedCategory`
- modal open/close handlers

## Notes

- Time values are stored/handled in UTC milliseconds in the active app flow.
- The Resource row and task components subscribe to their own data to prevent unnecessary re-renders caused by parent updates or unrelated state changes.
- Tasks are filtered by We filter tasks by visually de-emphasizing non-matching items.
- The timeline is currently seeded from `src/data.ts`.
- If backend integration is added, map backend arrays into the same normalized shape used by context.
