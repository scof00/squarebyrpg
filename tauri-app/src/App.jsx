// App.jsx
import React, { useEffect } from "react";
import DevPanel from "./Components/DevPanel";
import { Routes, Route, Outlet } from "react-router-dom";
import { Home } from "./components/Home";
import { CombatGeneric } from "./components/CombatLayout/CombatGeneric";
import { initDatabase } from "./Utils/databaseInit";
import { SettingsDisplay } from "./components/Settings";
import { Scene1 } from "./components/GameFlow/Scene1";
import { Scene2 } from "./components/GameFlow/Scene2";
import "./App.css";

export function App() {
  React.useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    function scaleGame() {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      const scale = Math.max(0.3, Math.min(scaleX, scaleY));

      document.documentElement.style.setProperty("--scale", scale);

      // Debug logging
      console.log("Window size:", window.innerWidth, "x", window.innerHeight);
      console.log("Scale:", scale);
      console.log("Final game size:", 1920 * scale, "x", 1080 * scale);
    }

    window.addEventListener("resize", scaleGame);
    scaleGame();

    return () => window.removeEventListener("resize", scaleGame);
  }, []);

  return (
    <div id="gameContainer">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SettingsDisplay />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/devPanel" element={<DevPanel />} />
          <Route path="/combat" element={<CombatGeneric />} />
          <Route path="/Scene1" element={<Scene1 />} />
          <Route path="/Scene2" element={<Scene2 />} />
        </Route>
      </Routes>
    </div>
  );
}
