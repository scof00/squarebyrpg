// initFiles.js
import { writeJson, readJson } from "./jsonCrud";
import { exists, BaseDirectory } from "@tauri-apps/plugin-fs";
import { questsStart, playersStart, inventoryStart } from "./schemas";

export async function initGameData() {
  try {
    // Check and initialize players.json
    const playersExists = await exists("players.json", {
      baseDir: BaseDirectory.AppLocalData,
    });
    if (!playersExists) {
      await writeJson("players.json", playersStart);
      console.log("✅ Initialized players.json");
    } else {
      console.log("📁 players.json already exists, skipping initialization");
    }

    // Check and initialize quests.json
    const questsExists = await exists("quests.json", {
      baseDir: BaseDirectory.AppLocalData,
    });
    if (!questsExists) {
      await writeJson("quests.json", questsStart);
      console.log("✅ Initialized quests.json");
    } else {
      console.log("📁 quests.json already exists, skipping initialization");
    }

    // Check and initialize inventory.json
    const inventoryExists = await exists("inventory.json", {
      baseDir: BaseDirectory.AppLocalData,
    });
    if (!inventoryExists) {
      await writeJson("inventory.json", inventoryStart);
      console.log("✅ Initialized inventory.json");
    } else {
      console.log("📁 inventory.json already exists, skipping initialization");
    }

    console.log("🎮 Game data initialization complete");
  } catch (error) {
    console.error("❌ Failed to initialize game data:", error);
  }
}
