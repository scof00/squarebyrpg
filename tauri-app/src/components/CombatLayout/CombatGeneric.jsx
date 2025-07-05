import { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import "../../styles/combat.css";
import { AttackSequence } from "../CombatActions/attack";
import { useNavigate } from "react-router-dom";
import { Enemies } from "./Enemies"; // import it here
import { getRandomEnemiesByDifficulty } from "../../Utils/enemyDB";
import { EnemyBehaviorSorter } from "../Behavior/EnemyBehaviorSorter";
import useCombatController from "../../Utils/useCombat";

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
  const [attackingEnemyIndex, setAttackingEnemyIndex] = useState(null);

  const navigate = useNavigate();
  const hasResolved = useRef(false);

  // Combat options array for easier management
  const combatOptions = [
    { label: "Attack", action: handleAttackClick },
    { label: "Defend", action: () => console.log("Defend") },
    { label: "Item", action: () => console.log("Item") },
    { label: "Run", action: () => navigate("/") }
  ];

  // Controller support
  const {
    focus,
    selectedOptionIndex,
    selectedEnemyIndex: controllerSelectedEnemyIndex,
    setFocus
  } = useCombatController({
    numEnemies: enemies.length,
    numOptions: combatOptions.length,
    onConfirmAction: (optionIndex) => {
      if (combatOptions[optionIndex]) {
        combatOptions[optionIndex].action();
      }
    },
    onConfirmEnemy: (enemyIndex) => {
      setSelectedEnemyIndex(enemyIndex);
    },
    onCancel: () => {
      console.log("Cancel pressed");
    },
    playerTurnActive: isPlayerTurn && !isAttacking
  });

  // Load enemies and initialize selection
  useEffect(() => {
    const fetchEnemies = async () => {
      const count = Math.floor(Math.random() * 3) + 3;
      const loaded = await getRandomEnemiesByDifficulty("Easy", count);
      const withHP = loaded.map((e) => ({
        ...e,
        currentHP: e.health ?? 50,
      }));
      setEnemies(withHP);
      
      // Set initial selection to first enemy (index 0)
      if (withHP.length > 0) {
        setSelectedEnemyIndex(0);
      }
    };

    fetchEnemies();
  }, []);

  // Sync controller enemy selection with component state
  useEffect(() => {
    if (controllerSelectedEnemyIndex !== null) {
      setSelectedEnemyIndex(controllerSelectedEnemyIndex);
    }
  }, [controllerSelectedEnemyIndex]);

  const playSwordSound = () => {
    const audio = new Audio("/sounds/sword-swing.mp3");
    audio.play();
  };

  const playEnemySound = () => {
    const audio = new Audio("/sounds/enemy-slash.mp3");
    audio.play()
  }

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

  function handleAttackClick() {
    if (!isAttacking && selectedEnemyIndex !== null) {
      setIsAttacking(true);
    }
  }

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
        setIsPlayerTurn(false);
        setTimeout(() => enemyTurn(), 1500);
      }
      return remaining;
    });
  };

  const isEnemyTurnRunning = useRef(false);

  const enemyTurn = async () => {
    if (isEnemyTurnRunning.current) return;
    isEnemyTurnRunning.current = true;

    // Get current alive enemies
    const currentEnemies = enemies.filter(enemy => enemy.currentHP > 0);
    
    // Process each alive enemy sequentially
    for (let i = 0; i < currentEnemies.length; i++) {
      const enemy = currentEnemies[i];
      // Find the original index for visual effects
      const originalIndex = enemies.findIndex(e => e === enemy);
      
      setAttackingEnemyIndex(originalIndex);
      playEnemySound();
      await EnemyBehaviorSorter(enemy, setPlayerHealth, playerHealth);
      await new Promise((res) => setTimeout(res, 600));
      setAttackingEnemyIndex(null);
    }

    setTimeout(() => {
      setRound((prev) => prev + 1);
      setPlayerActionsLeft(2);
      setIsPlayerTurn(true);
      isEnemyTurnRunning.current = false;
    }, 1000);
  };

  return (
    <div className="genericCombat">
      <h1 className="combatTitle">
        ⚔︎ Round: {round} - {isPlayerTurn ? "Player's Turn" : "Enemy's Turn"} ⚔︎
      </h1>

      {/* ENEMIES HERE */}
      <Enemies
        enemies={enemies}
        selectedEnemyIndex={selectedEnemyIndex}
        onSelectEnemy={setSelectedEnemyIndex}
        attackingEnemyIndex={attackingEnemyIndex}
        controllerHighlight={null}
      />

      <div className="playerContainer">
        <img className={`square ${attackAnimation ? "attack" : ""}`} src="../../public/images/Squareby.svg"></img>
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
        {combatOptions.map((option, index) => (
          <Button
            key={index}
            className={`combatOption ${
              focus === "menu" && selectedOptionIndex === index ? "controller-selected" : ""
            }`}
            onClick={option.action}
            disabled={
              (index === 0 && (isAttacking || selectedEnemyIndex === null || !isPlayerTurn)) ||
              (!isPlayerTurn && index !== 3)
            }
          >
            {option.label}
          </Button>
        ))}
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
              navigate("/");
            }}
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};