import React, { useEffect, useState } from "react";
import {
  createPlayer,
  getAllPlayers,
  updatePlayer,
  deletePlayer,
} from "../Utils/playerDB";
import {
  createEnemy,
  getAllEnemies,
  updateEnemy,
  deleteEnemy,
} from "../Utils/enemyDB";
import "../styles/devPanel.css"
import { useNavigate } from "react-router-dom";

// Enum values for dropdown selects
const difficultyOptions = ["Easy", "Medium", "Hard", "Extreme"];
const enemyTypeOptions = [
  "Slime",
  "Ogre",
  "Plinth",
  "Mage",
  "Healer",
  "Witch",
  "Goblin",
  "Archer",
  "Devil",
  "Plant",
  "Smudge",
  "Bat",
  "Dragon",
  "Knight"
];

// Schemas for fields and types per table
const schemas = {
  players: {
    name: "string",
    level: "number",
    className: "string",
  },
  enemy: {
    name: "string",
    health: "number",
    defense: "number",
    difficulty: "enum", // enum will be dropdown
    type: "enum", // enum dropdown
    image: "string",
  },
};

// CRUD function maps
const crudMap = {
  players: {
    getAll: getAllPlayers,
    create: createPlayer,
    update: updatePlayer,
    delete: deletePlayer,
  },
  enemy: {
    getAll: getAllEnemies,
    create: createEnemy,
    update: updateEnemy,
    delete: deleteEnemy,
  },
};

// Helper to build empty entry for a schema
function buildEmptyEntry(schema) {
  const obj = {};
  for (const [key, type] of Object.entries(schema)) {
    if (type === "number") obj[key] = 0;
    else if (type === "enum") obj[key] = "";
    else obj[key] = "";
  }
  return obj;
}

export default function DevPanel() {
  const [currentTable, setCurrentTable] = useState("players");
  const [items, setItems] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState(buildEmptyEntry(schemas["players"]));
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  // Load data when table or after changes
  useEffect(() => {
    loadItems();
    setNewEntry(buildEmptyEntry(schemas[currentTable]));
    setEditingItem(null);
    setEditForm({});
    setShowForm(false);
  }, [currentTable]);

  async function loadItems() {
    const all = await crudMap[currentTable].getAll();
    setItems(all || []);
  }

  function handleInputChange(key, value, isEdit = false) {
    if (isEdit) {
      setEditForm((prev) => ({ ...prev, [key]: value }));
    } else {
      setNewEntry((prev) => ({ ...prev, [key]: value }));
    }
  }

  async function handleAdd() {
    await crudMap[currentTable].create(newEntry);
    setNewEntry(buildEmptyEntry(schemas[currentTable]));
    setShowForm(false);
    loadItems();
  }

  async function handleUpdate() {
    if (!editingItem?.id) return;
    await crudMap[currentTable].update(editingItem.id, editForm);
    setEditingItem(null);
    setEditForm({});
    loadItems();
  }

  async function handleDelete(id) {
    if (!id) return;
    if (window.confirm(`Delete entry with ID ${id}?`)) {
      await crudMap[currentTable].delete(id);
      loadItems();
    }
  }

  const filtered = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
  );

  // Render input based on type, with enum support
  function renderInput(key, type, value, onChange) {
    if (type === "enum") {
      const options =
        key === "difficulty"
          ? difficultyOptions
          : key === "type"
          ? enemyTypeOptions
          : [];
      return (
        <select
          className="devpanel-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    } else if (type === "number") {
      return (
        <input
          className="devpanel-input"
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    } else {
      return (
        <input
          className="devpanel-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
  }

  return (
    <div className="devpanel-container p-4 space-y-4">
      <h1 className="devpanel-title">Dev Panel</h1>
      <button
        onClick={() => navigate("/")}
        className="devpanel-home-btn"
        style={{ marginBottom: "1rem" }}
      >
        Return to Home
      </button>

      {/* Table selector */}
      <select
        className="devpanel-select"
        value={currentTable}
        onChange={(e) => setCurrentTable(e.target.value)}
      >
        {Object.keys(schemas).map((table) => (
          <option key={table} value={table}>
            {table.charAt(0).toUpperCase() + table.slice(1)}
          </option>
        ))}
      </select>

      {/* Filter */}
      <input
        type="text"
        className="devpanel-filter"
        placeholder="Filter..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      {/* Add new toggle */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="devpanel-toggle-btn"
      >
        {showForm ? "Cancel" : `Add New ${currentTable.slice(0, -1)}`}
      </button>

      {/* Add new form */}
      {showForm && (
        <div className="devpanel-form">
          <h2 className="devpanel-form-title">New {currentTable.slice(0, -1)}</h2>
          {Object.entries(schemas[currentTable]).map(([key, type]) => (
            <div key={key} className="devpanel-form-group">
              <label className="devpanel-label">{key}</label>
              {renderInput(key, type, newEntry[key], (val) =>
                handleInputChange(key, val)
              )}
            </div>
          ))}
          <button onClick={handleAdd} className="devpanel-submit-btn">
            Submit
          </button>
        </div>
      )}

      {/* List */}
      <ul className="devpanel-list">
        {filtered.map((item) => (
          <li key={item.id} className="devpanel-list-item">
            {editingItem?.id === item.id ? (
              <div className="devpanel-edit-form space-y-2">
                {Object.entries(schemas[currentTable]).map(([key, type]) => (
                  <div key={key} className="devpanel-form-group">
                    <label className="devpanel-label">{key}</label>
                    {renderInput(key, type, editForm[key], (val) =>
                      handleInputChange(key, val, true)
                    )}
                  </div>
                ))}
                <button onClick={handleUpdate} className="devpanel-save-btn mr-2">
                  Save
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="devpanel-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <pre className="devpanel-json">{JSON.stringify(item, null, 2)}</pre>
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setEditForm(item);
                  }}
                  className="devpanel-edit-btn mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="devpanel-delete-btn"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
