import { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import "../../styles/combat.css";
import { AttackSequence } from "../CombatActions/attack";
import { useNavigate } from "react-router-dom";
import { Enemies } from "./Enemies"; // import it here
import { getRandomEnemiesByDifficulty } from "../../Utils/enemyDB";
import { EnemyBehaviorSorter } from "../Behavior/EnemyBehaviorSorter";

export const CombatGeneric = () => {
  const [enemies, setEnemies] = useState([]);
  const [selectedEnemyIndex, setSelectedEnemyIndex] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [turn, setTurn] = useState(1);
  const [playerActionsLeft, setPlayerActionsLeft] = useState(2);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(100);
  const [round, setRound] = useState(1);

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

  const playerHealthPercent = (playerHealth / playerMaxHealth) * 100;

  const applyDamage = (amount) => {
    console.log("Damage:", amount);
    setEnemies((prev) =>
      prev
        .map((enemy, i) =>
          i === selectedEnemyIndex
            ? { ...enemy, currentHP: Math.max(enemy.currentHP - amount, 0) }
            : enemy
        )
        .filter((enemy) => enemy.currentHP > 0)
    );

    setSelectedEnemyIndex((prevIndex) => {
      if (enemies[prevIndex] && enemies[prevIndex].currentHP - amount <= 0) {
        return null;
      }
      return prevIndex;
    });
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
      handlePlayerAction();
    }, 500);
  };

  const handlePlayerAction = async () => {
    setPlayerActionsLeft((prev) => {
      const remaining = prev - 1;
      if (remaining <= 0) {
        // Switch to enemy turn after player finishes
        setIsPlayerTurn(false);
        setTimeout(() => enemyTurn(), 1500); // slight delay to simulate enemy thinking
      }
      return remaining;
    });
  };

  const isEnemyTurnRunning = useRef(false);

  const enemyTurn = async () => {
    if (isEnemyTurnRunning.current) return;
  isEnemyTurnRunning.current = true;
    console.log("Enemy Turn Started");
    // Example enemy behavior
    for (const enemy of enemies) {
      if (enemy.currentHP > 0) {
        await EnemyBehaviorSorter(enemy, setPlayerHealth, playerHealth);
        await new Promise((res) => setTimeout(res, 500));
      }
    }

    // Wait for attacks to visually/temporally finish (if needed)
    setTimeout(() => {
      // Increment turn number
      setRound((prev) => prev + 1);
      // Reset player state
      setPlayerActionsLeft(2);
      setIsPlayerTurn(true);
      isEnemyTurnRunning.current = false;
    }, 1000); // delay to simulate enemy animations
  };

  return (
    <div className="genericCombat">
      <Button onClick={() => navigate("/")}>Home</Button>
      <h1 className="combatTitle">
        ⚔︎ Round: {round} - {isPlayerTurn ? "Player's Turn" : "Enemy's Turn"} ⚔︎
      </h1>

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
            <div
              className="healthFill"
              style={{
                width: `${playerHealthPercent}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
            <div className="hpNumbers">
              {playerHealth} / {playerMaxHealth}
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

      <AttackSequence
        trigger={isAttacking && !attackAnimation}
        onResolve={handleAttackResolved}
        onDismiss={() => setIsAttacking(false)}
      />

      {enemies.length === 0 && (
        <div className="overlay">
          <button
            className="proceedButton"
            onClick={() => {
              // Your logic here, e.g., navigate to next screen or end combat
              navigate("/"); // or any other action
            }}
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};
