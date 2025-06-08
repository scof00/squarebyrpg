// initFiles.js
import { writeJson } from './jsonCrud';
import { playersSchema, questsSchema, inventorySchema } from './schemas';

export async function initGameData() {
  await writeJson('players.json', playersSchema);
  await writeJson('quests.json', questsSchema);
  await writeJson('inventory.json', inventorySchema);

  console.log('Game data initialized.');
}
