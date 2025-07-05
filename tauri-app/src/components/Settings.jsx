import React, { useState } from "react";
import { Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function SettingsDisplay() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  const toggleOverlay = () => {
    setIsOpen(!isOpen);
    setConfirmAction(null); // Reset any confirm prompts
  };

  const handleConfirm = (action) => {
    setConfirmAction(action);
  };

  const currentWindow = getCurrentWindow();

  const executeConfirmedAction = async () => {
  if (confirmAction === "home") {
    navigate("/");
  } else if (confirmAction === "quit") {
    await currentWindow.close();
  }
  setIsOpen(false);         // ✅ Close overlay
  setConfirmAction(null);   // ✅ Clear confirmation state
};


  return (
    <>
      <button className="settings-button" onClick={toggleOverlay}>
        <Settings size={24} />
      </button>

      {isOpen && (
        <div className="overlay">
          <div className="settings-menu">
            {confirmAction ? (
              <>
                <p className="confirm-text">
                  You are about to exit without saving. Are you sure you want to continue?
                </p>
                <div className="confirm-buttons">
                  <button onClick={executeConfirmedAction}>Yes</button>
                  <button onClick={() => setConfirmAction(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <button className="close-button" onClick={toggleOverlay}>
                  <X size={24} />
                </button>
                <ul className="menu-options">
                  <li><button>Collection</button></li>
                  <li><button>Settings</button></li>
                  <li><button onClick={() => handleConfirm("home")}>Return to Home</button></li>
                  <li><button onClick={() => handleConfirm("quit")}>Quit</button></li>
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
