// App.jsx
import React from "react";
import DevPanel from "./Components/DevPanel";
import { Routes, Route, Outlet } from "react-router-dom";
import { Home } from "./components/Home";
import { CombatGeneric } from "./components/CombatLayout/CombatGeneric";
import { initDatabase } from "./Utils/databaseInit";
import { SettingsDisplay } from "./components/Settings";
import { Scene1 } from "./components/GameFlow/Scene1";

export function App() {
  React.useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Routes>
      <Route
      path="/"
      element={
        <>
        <SettingsDisplay/>
        <Outlet />
        </>
      }
      >

      <Route path="/" element={<Home />} />
      <Route path="/devPanel" element={<DevPanel />} />
      <Route path="/combat" element={<CombatGeneric />} />
      <Route path="/Scene1" element={<Scene1 />}/>
      </Route>
    </Routes>
  );
}
