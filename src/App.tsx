import { useState } from "react";
import { projects, resources, tasks as seedTasks } from "./data";
import type { Category, Task } from "./lib/types";
import TopNav from "./components/TopNav";
import Timeline from "./components/Timeline";
import CreateTaskModal from "./components/CreateTaskModal";

export default function App() {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All",
  );

  const handleCreateTask = (task: Task) => {
    setTasks((current) => [...current, task]);
    setIsCreateTaskModalOpen(false);
  };
  const handleDeleteTask = (taskId: Task["id"]) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-950 font-sans antialiased text-slate-200">
      <TopNav
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onCreateTaskClick={() => setIsCreateTaskModalOpen(true)}
      />
      <main className="flex-1 overflow-hidden">
        <Timeline
          tasks={tasks}
          selectedCategory={selectedCategory}
          onDeleteTask={handleDeleteTask}
        />
      </main>
      {isCreateTaskModalOpen && (
        <CreateTaskModal
          existingTasks={tasks}
          projects={projects}
          resources={resources}
          onCreateTask={handleCreateTask}
          onClose={() => setIsCreateTaskModalOpen(false)}
        />
      )}
    </div>
  );
}
