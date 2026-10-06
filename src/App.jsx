import { useState } from "react";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import Journal from "./components/Journal";
import Meditate from "./components/Meditate";
import DreamLog from "./components/DreamLog";
import Therapist from "./components/Therapist";

const VIEWS = {
  dashboard: Dashboard,
  journal: Journal,
  meditate: Meditate,
  dreams: DreamLog,
  therapist: Therapist,
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const View = VIEWS[active];

  return (
    <div className="flex min-h-screen bg-dusk-50">
      <Sidebar active={active} onChange={setActive} />
      <main className="flex-1 px-5 md:px-10 py-8 md:py-12 pb-24 md:pb-12 max-w-4xl mx-auto w-full">
        <View onChange={setActive} />
      </main>
      <BottomNav active={active} onChange={setActive} />
    </div>
  );
}
