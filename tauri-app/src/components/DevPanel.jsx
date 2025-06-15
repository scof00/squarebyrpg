import React, { useEffect, useState } from "react";
import {
  readJson,
  writeJson,
  addToJson,
  deleteFromJson,
} from "../Utils/jsonCrud";
import { playerSchema, questSchema, inventorySchema } from "../Utils/schemas";

const DATA_FILES = ["players.json", "quests.json", "inventory.json"];

const SCHEMA_MAP = {
  "players.json": playerSchema,
  "quests.json": questSchema,
  "inventory.json": inventorySchema,
};

export default function DevPanel() {
  const [table, setTable] = useState("players.json");
  const [entries, setEntries] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [newEntry, setNewEntry] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadEntries();
    setNewEntry({});
    setShowForm(false);
  }, [table]);

  const loadEntries = async () => {
    const data = await readJson(table);
    const cleaned = (data || []).filter((e) => e && typeof e === "object");
    setEntries(cleaned);
  };

  const handleAddChange = (key, value) => {
    setNewEntry((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddSubmit = async () => {
    try {
      const maxId = entries.reduce((max, e) => Math.max(max, e?.id || 0), 0);
      const entryWithId = {
        ...newEntry,
        id: maxId + 1,
      };

      await addToJson(table, entryWithId);
      setNewEntry({});
      setShowForm(false);
      loadEntries();
    } catch (err) {
      alert("Failed to add entry: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (id == null) {
      alert("Invalid entry. Missing ID.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete entry with ID ${id}?`
    );
    if (!confirmed) return;

    await deleteFromJson(table, (e) => e?.id === id);

    loadEntries();
  };

  const handleSave = async () => {
    await writeJson(table, entries);
    loadEntries();
  };

  const filtered = (entries || []).filter(
    (e) =>
      e && JSON.stringify(e).toLowerCase().includes(filterText.toLowerCase())
  );

  const renderInput = (key, type) => {
    if (key === "id") return null;

    const value = newEntry[key] ?? "";

    if (type === "boolean") {
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => handleAddChange(key, e.target.checked)}
          className="ml-2"
        />
      );
    }

    return (
      <input
        type={type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) =>
          handleAddChange(
            key,
            type === "number" ? Number(e.target.value) : e.target.value
          )
        }
        className="border p-1 rounded w-full"
      />
    );
  };

  const schema = SCHEMA_MAP[table];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Developer Panel</h1>

      <select
        value={table}
        onChange={(e) => setTable(e.target.value)}
        className="p-2 border rounded"
      >
        {DATA_FILES.map((f) => (
          <option key={f} value={f}>
            {f.replace(".json", "")}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Filter..."
        className="border p-2 rounded w-full"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {showForm ? "Cancel" : "Add Entry"}
      </button>

      {showForm && schema && (
        <div className="border p-4 rounded space-y-2 bg-gray-100">
          <h2 className="font-semibold text-lg">New Entry</h2>
          {Object.entries(schema).map(
            ([key, type]) =>
              key !== "id" && (
                <div key={key}>
                  <label className="block font-medium mb-1">{key}</label>
                  {renderInput(key, type)}
                </div>
              )
          )}
          <button
            onClick={handleAddSubmit}
            className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
          >
            Submit
          </button>
        </div>
      )}

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
      >
        Save Changes
      </button>

      <ul className="space-y-2">
        {filtered.map((entry, idx) =>
          entry ? (
            <li
              key={entry.id != null ? entry.id : `entry-${idx}`}
              className="border p-2 rounded"
            >
              <pre className="text-sm whitespace-pre-wrap break-words">
                {JSON.stringify(entry, null, 2)}
              </pre>
              <button
                onClick={() => handleDelete(entry.id)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2"
              >
                Delete
              </button>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}
