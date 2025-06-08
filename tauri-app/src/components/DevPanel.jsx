// DevPanel.jsx
import React, { useEffect, useState } from 'react';
import { readJson, writeJson, addToJson, deleteFromJson } from '../Utils/jsonCrud';

const DATA_FILES = ['players.json', 'quests.json', 'inventory.json'];

export default function DevPanel() {
  const [table, setTable] = useState('players.json');
  const [entries, setEntries] = useState([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    loadEntries();
  }, [table]);

  const loadEntries = async () => {
    const data = await readJson(table);
    setEntries(data || []);
  };

  const handleAdd = async () => {
    const entry = prompt('Enter new entry as JSON');
    try {
      const parsed = JSON.parse(entry);
      await addToJson(table, parsed);
      loadEntries();
    } catch (err) {
      alert('Invalid JSON');
    }
  };

  const handleDelete = async (id) => {
    await deleteFromJson(table, (e) => e.id === id);
    loadEntries();
  };

  const handleSave = async () => {
    await writeJson(table, entries);
    loadEntries();
  };

  const filtered = entries.filter(e => JSON.stringify(e).includes(filterText));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Developer Panel</h1>

      <select
        value={table}
        onChange={(e) => setTable(e.target.value)}
        className="p-2 border rounded"
      >
        {DATA_FILES.map(f => (
          <option key={f} value={f}>{f.replace('.json', '')}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Filter..."
        className="border p-2 rounded w-full"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded">Add Entry</button>
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Save Changes</button>

      <ul className="space-y-2">
        {filtered.map((entry, idx) => (
          <li key={idx} className="border p-2 rounded">
            <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(entry, null, 2)}</pre>
            <button
              onClick={() => handleDelete(entry.id)}
              className="bg-red-500 text-white px-2 py-1 rounded mt-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
