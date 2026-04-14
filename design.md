# Design of Solution

## 1. Overview

This document describes the design decisions behind a timeline-based scheduling interface for managing tasks across resources and projects.

The goal of the system is to provide a clear and intuitive way to visualize work over time, making it easy to understand when tasks happen, who they are assigned to, and how they relate to projects.

---

## 2. Why a Timeline-Based UI?

A timeline view was chosen because the core problem of the system is time-based planning.

Compared to list or table-based layouts, a timeline provides:

- A clear visual representation of duration (start → end)
- Better understanding of overlaps and conflicts
- Easier interpretation of resource allocation over time
- Faster scanning of schedules without extra interactions

This makes it a natural fit for scheduling and planning use cases.

---

## 3. High-Level Concept

The system is built around three main entities:

- **Projects** – group related work together
- **Resources** – entities that perform work (e.g., equipment or teams)
- **Tasks** – time-bound work items assigned to a resource and project

The UI represents this as:

- Horizontal axis → time
- Vertical rows → resources
- Blocks → tasks placed within time ranges

---

## 4. UI Behaviour

The interface is designed to support:

- Viewing tasks across multiple resources
- Filtering tasks by project or category
- Highlighting relevant tasks while dimming non-relevant ones
- Basic interaction such as hover and selection

The focus is on clarity and usability in dense schedules.

---

## 5. Technology Choices

The system is built using a modern frontend stack:

### Frontend

- **React (TypeScript)** – component-based UI development
- **CSS / Tailwind (optional)** – styling and layout
- **Figma** – UI/UX design and prototyping

### State Management

- React Query for server data fetching and caching
- Lightweight client state management for UI interactions (e.g. selection, filters)

### Data Handling

- Data is handled in a structured way using IDs to represent relationships between tasks, projects, and resources.

---

## 6. Design Considerations

A few key design decisions were made:

- Timeline view was chosen for its natural mapping to time-based data
- Tasks remain visible during filtering but are visually de-emphasized instead of removed
- The UI is designed to stay readable even with a large number of tasks
- The structure is kept flexible to allow future improvements like real-time updates or advanced filtering

---

## 7. Summary

This design focuses on clarity, scalability, and usability.

The timeline-based approach provides a natural way to understand scheduling data, while the chosen frontend technologies allow for a responsive and maintainable implementation.
