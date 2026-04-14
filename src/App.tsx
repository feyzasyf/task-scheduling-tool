import TopNav from "./components/TopNav";
import Timeline from "./components/Timeline";

export default function App() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-950 font-sans antialiased text-slate-200">
      <TopNav />
      <main className="flex-1 overflow-hidden">
        <Timeline />
      </main>
    </div>
  );
}
