import { Moon, LayoutDashboard, NotebookPen, Wind, Sparkles, HeartHandshake } from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "journal", label: "Journal", icon: NotebookPen },
  { id: "meditate", label: "Meditate", icon: Wind },
  { id: "dreams", label: "Dream Log", icon: Sparkles },
  { id: "therapist", label: "Therapist", icon: HeartHandshake },
];

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-night-900 text-dusk-100 min-h-screen px-5 py-8">
      <div className="flex items-center gap-2 px-2 mb-10">
        <Moon size={22} className="text-dawn-400" strokeWidth={1.5} />
        <span className="font-display text-2xl tracking-tight text-white">Lucid</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-dusk-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-dawn-400" : ""} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3 py-4 rounded-xl bg-white/5 text-xs text-dusk-200/60 leading-relaxed">
        Your entries are private and only used to reflect your own patterns back to you.
      </div>
    </aside>
  );
}
