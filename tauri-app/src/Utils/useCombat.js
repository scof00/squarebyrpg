import { useEffect, useRef, useState } from "react";

export default function useCombatController({
  numEnemies,
  numOptions,
  onConfirmAction,
  onConfirmEnemy,
  onCancel,
  playerTurnActive
}) {
  const [focus, setFocus] = useState("menu"); // 'menu' or 'enemies'
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [selectedEnemyIndex, setSelectedEnemyIndex] = useState(0);
  const inputLockRef = useRef(false);
  const raf = useRef();
  const lastState = useRef({ buttons: [], axes: [] });

  const lockInput = () => {
    inputLockRef.current = true;
    setTimeout(() => {
      inputLockRef.current = false;
    }, 200);
  };

  const handleGamepadAction = (event) => {
    if (!playerTurnActive || inputLockRef.current) return;

    // Debug logging
    console.log("Controller event:", event, "Focus:", focus, "NumEnemies:", numEnemies);

    if (event.type === "button") {
      switch (event.index) {
        case 1: // B button (Xbox controller) - SELECT
          if (focus === "menu") {
            onConfirmAction(selectedOptionIndex);
          } else if (focus === "enemies") {
            onConfirmEnemy(selectedEnemyIndex);
          }
          break;
        case 2: // X button (Xbox controller) - CANCEL
          if (focus === "enemies") {
            setFocus("menu");
          } else {
            onCancel?.();
          }
          break;
        case 4: // L1 - Move right through enemies (swapped for reverse display)
          console.log("L1 pressed - Focus:", focus, "NumEnemies:", numEnemies);
          if (numEnemies > 0) {
            setSelectedEnemyIndex((i) => {
              const newIndex = (i + 1) % numEnemies;
              console.log("L1: Changing enemy from", i, "to", newIndex);
              return newIndex;
            });
            lockInput();
          }
          break;
        case 5: // R1 - Move left through enemies (swapped for reverse display)
          console.log("R1 pressed - Focus:", focus, "NumEnemies:", numEnemies);
          if (numEnemies > 0) {
            setSelectedEnemyIndex((i) => {
              const newIndex = i === 0 ? numEnemies - 1 : i - 1;
              console.log("R1: Changing enemy from", i, "to", newIndex);
              return newIndex;
            });
            lockInput();
          }
          break;
      }
    } else if (event.type === "axis" && !inputLockRef.current) {
      if (focus === "menu") {
        if (event.axis === 1) {
          setSelectedOptionIndex((prev) => {
            const next = prev + event.direction;
            if (next < 0) return numOptions - 1;
            if (next >= numOptions) return 0;
            return next;
          });
          lockInput();
        }
      } else if (focus === "enemies") {
        // Handle bumpers as axes (common on many controllers)
        if (event.axis === 6) { // L1 bumper as axis
          if (numEnemies > 0) {
            setSelectedEnemyIndex((i) => (i + 1) % numEnemies);
            lockInput();
          }
        } else if (event.axis === 7) { // R1 bumper as axis
          if (numEnemies > 0) {
            setSelectedEnemyIndex((i) => i === 0 ? numEnemies - 1 : i - 1);
            lockInput();
          }
        }
      }
      
      // Allow bumpers to work regardless of focus when there are enemies
      if (numEnemies > 0) {
        if (event.axis === 6) { // L1 bumper as axis
          setSelectedEnemyIndex((i) => (i + 1) % numEnemies);
          lockInput();
        } else if (event.axis === 7) { // R1 bumper as axis
          setSelectedEnemyIndex((i) => i === 0 ? numEnemies - 1 : i - 1);
          lockInput();
        }
      }
    }
  };

  useEffect(() => {
    const poll = () => {
      const gp = navigator.getGamepads?.()[0];
      if (!gp) {
        raf.current = requestAnimationFrame(poll);
        return;
      }

      const buttons = gp.buttons.map((b) => b.pressed);
      const axes = gp.axes.map((a) => Math.round(a * 100) / 100);

      // Initialize lastState if empty (prevents false triggers on first poll)
      if (lastState.current.buttons.length === 0) {
        lastState.current = { buttons, axes };
        raf.current = requestAnimationFrame(poll);
        return;
      }

      // Check bumper buttons (L1/R1 are often buttons 4/5)
      buttons.forEach((pressed, i) => {
        const wasPressed = lastState.current.buttons[i];
        if (pressed && !wasPressed) {
          console.log(`Button ${i} pressed`);
          handleGamepadAction({ type: "button", index: i });
        }
      });

      // Axis threshold detection for joystick (vertical movement in menu)
      const threshold = 0.5;
      [1].forEach((axis) => {
        const now = axes[axis];
        const was = lastState.current.axes[axis] || 0;
        if (now > threshold && !(was > threshold)) {
          handleGamepadAction({ type: "axis", axis, direction: 1 });
        } else if (now < -threshold && !(was < -threshold)) {
          handleGamepadAction({ type: "axis", axis, direction: -1 });
        }
      });

      // Bumper detection as axes (L1/R1 are often axes 6/7)
      const bumperThreshold = 0.5;
      [6, 7].forEach((axis) => {
        const now = axes[axis];
        const was = lastState.current.axes[axis] || 0;
        if (now > bumperThreshold && !(was > bumperThreshold)) {
          handleGamepadAction({ type: "axis", axis, direction: 1 });
        }
      });

      lastState.current = { buttons, axes };
      raf.current = requestAnimationFrame(poll);
    };

    raf.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf.current);
  }, [numEnemies, numOptions, playerTurnActive, selectedOptionIndex, selectedEnemyIndex, focus]);

  // Ensure selectedEnemyIndex stays within bounds when numEnemies changes
  useEffect(() => {
    if (numEnemies > 0 && selectedEnemyIndex >= numEnemies) {
      setSelectedEnemyIndex(0);
    }
  }, [numEnemies, selectedEnemyIndex]);

  return {
    focus,
    selectedOptionIndex,
    selectedEnemyIndex,
    setFocus,
  };
}