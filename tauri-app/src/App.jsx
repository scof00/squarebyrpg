// App.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { initGameData } from "./Utils/initFiles";
import DevPanel from "./Components/DevPanel";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { CombatGeneric } from "./components/CombatLayout/CombatGeneric";
import { initDatabase } from "./Utils/databaseInit";

export function App() {
  React.useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/devPanel" element={<DevPanel />} />
      <Route path="/combat" element={<CombatGeneric />} />
    </Routes>
  );
}
