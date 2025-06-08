// App.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initGameData } from './Utils/initFiles';
import DevPanel from './Components/DevPanel';

export function App() {
  React.useEffect(() => {
    initGameData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Squareby RPG Admin</h1>
      <DevPanel />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
