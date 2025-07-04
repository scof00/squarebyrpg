import { useEffect, useRef, useState } from "react";

export default function useGamepadNavigation(buttons, initialIndex = 0, lockDuration = 200) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const inputLockRef = useRef(false);
  const inputLockTimeoutRef = useRef(null);
  const raf = useRef();
  const lastState = useRef({ buttons: [], axes: [] });

  const handleGamepadAction = (event) => {
    if (event.type === "button") {
      switch (event.index) {
        case 1: // A button
          {
            const btn = buttons[selectedIndex];
            if (btn?.onClick) btn.onClick();
          }
          break;
        case 2: // B button
          break;
        case 9: // Start button
          break;
      }
    } else if (event.type === "axis") {
      if (inputLockRef.current) return;

      if (event.axis === 1 || event.axis === 9) {
        if (event.direction === -1) {
          setSelectedIndex(i => (i === 0 ? buttons.length - 1 : i - 1));
          inputLockRef.current = true;
          clearTimeout(inputLockTimeoutRef.current);
          inputLockTimeoutRef.current = setTimeout(() => {
            inputLockRef.current = false;
          }, lockDuration);
        } else if (event.direction === 1) {
          setSelectedIndex(i => (i === buttons.length - 1 ? 0 : i + 1));
          inputLockRef.current = true;
          clearTimeout(inputLockTimeoutRef.current);
          inputLockTimeoutRef.current = setTimeout(() => {
            inputLockRef.current = false;
          }, lockDuration);
        }
      }
    }
  };

  useEffect(() => {
    const pollGamepads = () => {
      const gamepads = navigator.getGamepads?.();
      if (!gamepads) {
        raf.current = requestAnimationFrame(pollGamepads);
        return;
      }
      const gp = gamepads[0];
      if (!gp) {
        raf.current = requestAnimationFrame(pollGamepads);
        return;
      }

      const buttonsState = gp.buttons.map(b => b.pressed);
      const axesState = gp.axes.map(a => Math.round(a * 100) / 100);

      if (lastState.current.buttons.length === 0) {
        lastState.current.buttons = buttonsState;
        lastState.current.axes = axesState;
        raf.current = requestAnimationFrame(pollGamepads);
        return;
      }

      buttonsState.forEach((pressed, i) => {
        const wasPressed = lastState.current.buttons[i];
        if (pressed && !wasPressed) {
          handleGamepadAction({ type: "button", index: i });
        }
      });

      const AXIS_THRESHOLD = 0.5;

      // For axis 1 (left stick vertical)
      if (axesState[1] < -AXIS_THRESHOLD && !(lastState.current.axes[1] < -AXIS_THRESHOLD)) {
        handleGamepadAction({ type: "axis", axis: 1, direction: -1 });
      } else if (axesState[1] > AXIS_THRESHOLD && !(lastState.current.axes[1] > AXIS_THRESHOLD)) {
        handleGamepadAction({ type: "axis", axis: 1, direction: 1 });
      } else if (Math.abs(axesState[1]) < AXIS_THRESHOLD) {
        // Reset input lock when stick is centered to allow new navigation
        inputLockRef.current = false;
        if (inputLockTimeoutRef.current) clearTimeout(inputLockTimeoutRef.current);
      }

      // For axis 9 (dpad vertical)
      if (axesState[9] < -AXIS_THRESHOLD && !(lastState.current.axes[9] < -AXIS_THRESHOLD)) {
        handleGamepadAction({ type: "axis", axis: 9, direction: -1 });
      } else if (axesState[9] > AXIS_THRESHOLD && !(lastState.current.axes[9] > AXIS_THRESHOLD)) {
        handleGamepadAction({ type: "axis", axis: 9, direction: 1 });
      } else if (Math.abs(axesState[9]) < AXIS_THRESHOLD) {
        inputLockRef.current = false;
        if (inputLockTimeoutRef.current) clearTimeout(inputLockTimeoutRef.current);
      }

      lastState.current = { buttons: buttonsState, axes: axesState };
      raf.current = requestAnimationFrame(pollGamepads);
    };

    raf.current = requestAnimationFrame(pollGamepads);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (inputLockTimeoutRef.current) clearTimeout(inputLockTimeoutRef.current);
    };
  }, [buttons, selectedIndex]);

  return { selectedIndex, setSelectedIndex };
}
