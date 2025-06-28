// Enemies.jsx
import React from "react";
import "../../styles/combat.css"
export const Enemies = ({ enemies, selectedEnemyIndex, onSelectEnemy, attackingEnemyIndex }) => {
  return (
    <div className="opponentContainer">
      {enemies.map((enemy, i) => {
        const percent = (enemy.currentHP / enemy.health) * 100;
        const isSelected = i === selectedEnemyIndex;
        const isAttacking = i === attackingEnemyIndex;

        return (
          <div
            key={enemy.id}
            className={`enemyCard ${isSelected ? "selected" : ""} ${isAttacking ? "enemyAttack" : ""}`}
            onClick={() => onSelectEnemy(i)}
          >
            {enemy.image ? (
              <img
                src={enemy.image}
                alt={enemy.name}
                className="enemyImage"
              />
            ) : (
              <div className="circle"></div>
            )}
            <div className="nameCard">
              <div className="pokemonName">{enemy.name}</div>
              <div className="healthBar">
                <div
                  className="healthFill"
                  style={{
                    width: `${percent}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <div className="hpNumbers">{enemy.currentHP} / {enemy.health}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
