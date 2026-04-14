import { projects, resources } from "./data";
import TopNav from "./components/TopNav";
import Timeline from "./components/Timeline";
import CreateTaskModal from "./components/CreateTaskModal";
import { AppStateProvider } from "./context/AppStateContext";
import { useAppState } from "./context/useAppState";

function AppContent() {
  const { isCreateTaskModalOpen } = useAppState();
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-950 font-sans antialiased text-slate-200">
      <TopNav />
      <main className="flex-1 overflow-hidden">
        <Timeline />
      </main>
      {isCreateTaskModalOpen && (
        <CreateTaskModal projects={projects} resources={resources} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
