import React from "react";
import { useNavigate } from "react-router-dom";
import { SceneDisplay } from "./SceneDisplay";

export function Scene1() {
  const navigate = useNavigate();

  const dialogue = [
    { speaker: "Narrator", text: "It was a cold and misty morning." },
    { speaker: "Hero", text: "Where... where am I?" },
    { speaker: "Villager", text: "You're safe now. Rest easy." },
  ];

  return (
    <SceneDisplay
      dialogue={dialogue}
      background="/backgrounds/town.jpg"
      onComplete={() => navigate("/Scene2")}
    />
  );
}
