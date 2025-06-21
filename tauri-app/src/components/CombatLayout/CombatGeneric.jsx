import { useState } from "react";
import { Button } from "reactstrap";
import "../../styles/combat.css";
import { AttackSequence } from "../CombatActions/attack";

export const CombatGeneric = () => {
  const [enemyHealth, setEnemyHealth] = useState({ currentHP: 50, maxHP: 50 });
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState(false);

  const playSwordSound = () => {
    const audio = new Audio("/sounds/sword-swing.mp3");
    audio.play();
  };

  const applyDamage = (amount) => {
    setEnemyHealth((prev) => ({
      ...prev,
      currentHP: Math.max(prev.currentHP - amount, 0),
    }));
  };

  const handleAttackClick = () => {
    if (!isAttacking) setIsAttacking(true);
  };

  const handleAttackResolved = (damage) => {
    // Show animation + play sound
    setAttackAnimation(true);
    playSwordSound();
    applyDamage(damage);

    // Reset everything after animation ends
    setTimeout(() => {
      setAttackAnimation(false);
      setIsAttacking(false);
    }, 500); // match .attack animation duration
  };

  const enemyHealthPercent = (enemyHealth.currentHP / enemyHealth.maxHP) * 100;

  return (
    <div className="genericCombat">
      <h1 className="combatTitle">⚔︎ Combat ⚔︎</h1>

      <div className="opponentContainer">
        <div className="circle"></div>
        <div className="nameCard">
          <div className="pokemonName">Enemy Circle</div>
          <div className="healthBar">
            <div
              className="healthFill"
              style={{ width: `${enemyHealthPercent}%`, transition: "width 0.5s ease" }}
            />
          </div>
        </div>
      </div>

      <div className="playerContainer">
        <div className={`square ${attackAnimation ? "attack" : ""}`}></div>
        <div className="nameCard playerNameCard">
          <div className="pokemonName">Squareby</div>
          <div className="healthBar">
            <div className="healthFill" style={{ width: "100%" }} />
          </div>
        </div>
      </div>

      <div className="combatOptions">
        <Button className="combatOption" onClick={handleAttackClick} disabled={isAttacking}>
          Attack
        </Button>
        <Button className="combatOption">Defend</Button>
        <Button className="combatOption">Item</Button>
        <Button className="combatOption">Run</Button>
      </div>

      {isAttacking && <AttackSequence onResolve={handleAttackResolved} />}
    </div>
  );
};
