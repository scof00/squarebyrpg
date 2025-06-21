import { useEffect } from "react";
import "../../styles/combat.css";

export const EnemyLayout = () => {
  const [enemies, setEnemies] = useState([]);

  useEffect(() => {
    setEnemies();
  }, []);

  return (
    <div className="opponentContainer">
      {enemies.map((enemy) => {
        return (
          <div>
            <div className="circle"></div>
            <div className="nameCard">
              <div className="pokemonName" id={enemy.id}>{enemy.name}</div>
              <div className="healthBar">
                <div
                  className="healthFill"
                  style={{
                    width: `${enemy.healthPercent}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
