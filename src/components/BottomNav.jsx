import { LayoutDashboard, NotebookPen, Wind, Sparkles, HeartHandshake } from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "journal", label: "Journal", icon: NotebookPen },
  { id: "meditate", label: "Meditate", icon: Wind },
  { id: "dreams", label: "Dreams", icon: Sparkles },
  { id: "therapist", label: "Support", icon: HeartHandshake },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-night-900 border-t border-white/10 flex justify-around py-2 z-20">
      {NAV.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${
              isActive ? "text-dawn-400" : "text-dusk-200/60"
            }`}
          >
            <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
