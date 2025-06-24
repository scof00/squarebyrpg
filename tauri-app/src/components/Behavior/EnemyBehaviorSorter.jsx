import { ScribBehavior } from "./ScribBehavior"

export const EnemyBehaviorSorter = (enemy, setPlayerHealth, playerHealth) => {
    switch (enemy.type) {
      case "Slime":
        ScribBehavior(enemy, setPlayerHealth, playerHealth)
        console.log("Scrib attacked")
        break;
      case "Ogre":
        handleOgreBehavior(enemy);
        break;
      case "Mage":
        handleMageBehavior(enemy);
        break;
      case "Healer":
        handleHealerBehavior(enemy);
        break;
      // Add more types as needed
      default:
        handleDefaultBehavior(enemy);
    }
};