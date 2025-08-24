import sql from "@tauri-apps/plugin-sql";

let dbInstance;

export async function initDatabase() {
  if (!dbInstance) {
    dbInstance = await sql.load("sqlite:game.db");
  }

  await dbInstance
    .execute(
      `
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      name VARCHAR NOT NULL,
      level INTEGER,
      class VARCHAR
    );
  `
    )
    .then(console.log("✅ players table created"));

  await dbInstance
    .execute(
      `
    CREATE TABLE IF NOT EXISTS enemy (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        health INTEGER NOT NULL,
        defense INTEGER NOT NULL,
        difficulty TEXT NOT NULL CHECK (
        difficulty IN ('Easy', 'Medium', 'Hard', 'Extreme')
            ),
        type TEXT NOT NULL CHECK (
            type IN (
            'Slime', 'Ogre', 'Plinth', 'Mage', 'Healer',
            'Witch', 'Goblin', 'Archer', 'Devil', 'Plant',
            'Smudge', 'Bat', 'Dragon', 'Knight'
            )
        ),
        image TEXT
        );
        `
    )
    .then(console.log("✅ enemy table created"));

    await dbInstance.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      type TEXT NOT NULL CHECK(type IN ('Attack', 'Defense', 'Health', 'Consumable')),
      rarity TEXT NOT NULL CHECK(rarity IN ('Common', 'Uncommon', 'Rare', 'Legendary'))
    );
  `
    )
    .then(console.log("✅ items table created"));

  return dbInstance;
}
