import { useEffect, useState, useRef } from "react";
import "../../styles/combat.css";
import {
  createRollDie,
  modifyAttack,
} from "../CombatActions/attackModification";

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export const AttackSequence = ({ trigger, onResolve, onDismiss }) => {
  const [diceValues, setDiceValues] = useState([null, null, null]);
  const [modBreakdown, setModBreakdown] = useState([]);
  const [finalTotal, setFinalTotal] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const hasResolved = useRef(false);

  useEffect(() => {
    if (trigger && !popupVisible) {
      setPopupVisible(true);
      hasResolved.current = false;
      runRoll();
    }
  }, [trigger]);

  const playDiceSound = () => {
    new Audio("/sounds/dice-roll.mp3").play();
  };

  const playSwordSound = () => {
    new Audio("/sounds/sword-slice.mp3").play();
  };

  const runRoll = async () => {
    setDiceValues([]);
    setModBreakdown([]);
    setFinalTotal(null);

    const rollDie = createRollDie(setDiceValues, playDiceSound);

    const { results, breakdown, total } = await modifyAttack(rollDie);

    setDiceValues(results);
    setModBreakdown(breakdown);
    setFinalTotal(total);

    playSwordSound();

    if (!hasResolved.current) {
      onResolve(total);
      hasResolved.current = true;
    }
  };

  const handleDismiss = () => {
    setPopupVisible(false);
    onDismiss();
  };

  if (!popupVisible) return null;

  return (
    <div className="dicePopupOverlay">
      <div className="dicePopupContent">
        <div className="diceRow">
          {diceValues.map((dieData, i) => {
            const isObject = typeof dieData === "object" && dieData !== null;
            const value = isObject ? dieData.value : dieData;
            const isExploded = isObject ? dieData.isExploded : false;

            return (
              <div
                key={i}
                className={`die ${isExploded ? "exploded-die" : ""}`}
              >
                {value !== null ? diceFaces[value - 1] : "?"}
              </div>
            );
          })}
        </div>

        <div className="diceBreakdown" style={{ marginTop: "1rem" }}>
          {modBreakdown.map((line, idx) => (
            <div key={idx} style={{ marginBottom: "0.3rem" }}>
              {line}
            </div>
          ))}
        </div>

        {finalTotal !== null && (
          <div style={{ fontWeight: "bold", marginTop: "1rem" }}>
            Total Damage: {finalTotal}
          </div>
        )}

        <button
          className="dismissButton"
          onClick={handleDismiss}
          style={{ marginTop: "1.5rem", padding: "0.5rem 1rem" }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
