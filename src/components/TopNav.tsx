import clsx from "clsx";
import type { Category } from "../data";
import { CATEGORIES } from "../data";

import { useState } from "react";

//TODO: Use a proper dropdown component from a library like Radix UI or Headless UI /Shadcn for better accessibility and features. This is just a simple implementation for demonstration purposes.

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default function TopNav() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All",
  );
  return (
    <header className="flex items-center gap-3 px-5 shrink-0 border-b border-slate-800 bg-slate-900 h-14">
      {/* Title */}
      <div className="flex items-center gap-2 mr-4">
        <span className="text-sm font-bold tracking-tight text-slate-50">
          Observatory Task Scheduler
        </span>
      </div>

      {/* Date range display   FOR DEMONSTRATION PURPOSES ONLY */}
      <div className="flex items-center gap-2 px-3 rounded-lg text-xs font-medium h-[34px] bg-slate-800 border border-slate-700 text-slate-400">
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          className="opacity-70"
        >
          <rect
            x="1"
            y="2"
            width="11"
            height="10"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M4 1v2M9 1v2M1 5h11"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        Apr 13 – 17
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* All categories dropdown ------------- this is not implemented */}
      <div className="relative">
        <button
          onClick={() => setCategoryOpen((v) => !v)}
          className={clsx(
            "flex items-center gap-2 px-3 rounded-lg text-xs font-medium h-[34px] border transition-colors",
            "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500",
            categoryOpen && "ring-2 ring-blue-500/20 border-blue-500/50",
          )}
        >
          {selectedCategory === "All" ? "All Categories" : selectedCategory}
          <ChevronDown />
        </button>

        {categoryOpen && (
          <div className="absolute right-0 top-full mt-2 rounded-lg overflow-hidden z-50 text-xs bg-slate-800 border border-slate-700 min-w-[160px] shadow-2xl shadow-black/50">
            {(["All", ...CATEGORIES] as (Category | "All")[]).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCategoryOpen(false);
                }}
                className={clsx(
                  "w-full text-left px-4 py-2.5 transition-colors block",
                  selectedCategory === cat
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-slate-700 hover:text-slate-200",
                )}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create task */}
      <button className="flex items-center gap-1.5 px-4 rounded-lg text-xs font-bold h-[34px] bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-900/20">
        <span className="text-lg leading-none mt-[-2px]">+</span>
        Create Task
      </button>
    </header>
  );
}
