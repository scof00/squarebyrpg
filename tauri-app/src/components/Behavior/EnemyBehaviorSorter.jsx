import { DragonBehavior } from "./DragonBehavior";
import { KnightBehavior } from "./KnightBehavior";
import { MageBehavior } from "./MageBehavior";
import { ScribBehavior } from "./ScribBehavior";
import { SmudgeBehavior } from "./SmudgeBehavior";

export const EnemyBehaviorSorter = async (
  enemy,
  setPlayerHealth,
  playerHealth
) => {
  switch (enemy.type) {
    case "Slime":
      ScribBehavior(enemy, setPlayerHealth, playerHealth);
      break;
    case "Ogre":
      handleOgreBehavior(enemy, setPlayerHealth, playerHealth);
      break;
    case "Mage":
      MageBehavior(enemy, setPlayerHealth, playerHealth);
      break;
    case "Healer":
      handleHealerBehavior(enemy, setPlayerHealth, playerHealth);
      break;
    case "Dragon":
      DragonBehavior(enemy, setPlayerHealth, playerHealth);
      break;
    case "Knight":
      KnightBehavior(enemy, setPlayerHealth, playerHealth);
      break;
    case "Plinth":
      SmudgeBehavior(enemy, setPlayerHealth, playerHealth);
      break;
  }
};
