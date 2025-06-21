import React, { useEffect, useState } from "react";
import {
  createPlayer,
  getAllPlayers,
  updatePlayer,
  deletePlayer,
} from "../Utils/playerDB";

export default function DevPanel() {
  const [players, setPlayers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [newPlayer, setNewPlayer] = useState({ name: "", level: 1, className: "" });
  const [showForm, setShowForm] = useState(false);

  // Load players on mount and after changes
  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const all = await getAllPlayers();
    setPlayers(all || []);
  }

  // Add a new player
  async function handleAdd() {
    await createPlayer(newPlayer);
    setNewPlayer({ name: "", level: 1, className: "" });
    setShowForm(false);
    loadPlayers();
  }

  // Delete player by ID
  async function handleDelete(id) {
    if (!id) return;
    if (window.confirm(`Delete player with ID ${id}?`)) {
      await deletePlayer(id);
      loadPlayers();
    }
  }

  // Filter players by text
  const filtered = players.filter((p) =>
    JSON.stringify(p).toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <h1>Dev Panel - Players</h1>

      <input
        placeholder="Filter..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Player"}
      </button>

      {showForm && (
        <div>
          <input
            placeholder="Name"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Level"
            value={newPlayer.level}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, level: Number(e.target.value) })
            }
          />
          <input
            placeholder="Class"
            value={newPlayer.className}
            onChange={(e) => setNewPlayer({ ...newPlayer, className: e.target.value })}
          />
          <button onClick={handleAdd}>Submit</button>
        </div>
      )}

      <ul>
        {filtered.map((p) => (
          <li key={p.id}>
            <pre>{JSON.stringify(p, null, 2)}</pre>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
