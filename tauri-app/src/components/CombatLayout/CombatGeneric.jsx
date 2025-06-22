import { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import "../../styles/combat.css";
import { AttackSequence } from "../CombatActions/attack";
import { useNavigate } from "react-router-dom";
import { Enemies } from "./Enemies"; // import it here
import { getRandomEnemiesByDifficulty } from "../../Utils/enemyDB";

export const CombatGeneric = () => {
  const [enemies, setEnemies] = useState([]);
  const [selectedEnemyIndex, setSelectedEnemyIndex] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState(false);

  const navigate = useNavigate();
  const hasResolved = useRef(false);

  useEffect(() => {
    const fetchEnemies = async () => {
      const count = Math.floor(Math.random() * 3) + 3;
      const loaded = await getRandomEnemiesByDifficulty("Easy", count);
      const withHP = loaded.map((e) => ({
        ...e,
        currentHP: e.health ?? 50,
      }));
      setEnemies(withHP);
    };

    fetchEnemies();
  }, []);

  const playSwordSound = () => {
    const audio = new Audio("/sounds/sword-swing.mp3");
    audio.play();
  };

  const applyDamage = (amount) => {
    console.log("Damage:", amount);
    setEnemies((prev) =>
      prev.map((enemy, i) =>
        i === selectedEnemyIndex
          ? { ...enemy, currentHP: Math.max(enemy.currentHP - amount, 0) }
          : enemy
      )
    );
  };

  const handleAttackClick = () => {
    if (!isAttacking && selectedEnemyIndex !== null) {
      setIsAttacking(true);
    }
  };

  const handleAttackResolved = (damage) => {
    if (hasResolved.current) return;
    hasResolved.current = true;

    console.log("Damage passed to applyDamage:", damage);

    setAttackAnimation(true);
    playSwordSound();
    applyDamage(damage);

    setTimeout(() => {
      setAttackAnimation(false);
      setIsAttacking(false);
      hasResolved.current = false;
    }, 500);
  };

  return (
    <div className="genericCombat">
      <Button onClick={() => navigate("/")}>Home</Button>
      <h1 className="combatTitle">⚔︎ Combat ⚔︎</h1>

      {/* ENEMIES HERE */}
      <Enemies
        enemies={enemies}
        selectedEnemyIndex={selectedEnemyIndex}
        onSelectEnemy={setSelectedEnemyIndex}
      />

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
        <Button
          className="combatOption"
          onClick={handleAttackClick}
          disabled={isAttacking || selectedEnemyIndex === null}
        >
          Attack
        </Button>
        <Button className="combatOption">Defend</Button>
        <Button className="combatOption">Item</Button>
        <Button className="combatOption" onClick={() => navigate("/")}>
          Run
        </Button>
      </div>

      {isAttacking && !attackAnimation && (
        <AttackSequence
          key={`attack-${Date.now()}`}
          onResolve={handleAttackResolved}
        />
      )}
    </div>
  );
};
