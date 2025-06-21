import sql from '@tauri-apps/plugin-sql';

let dbInstance;

export async function initDatabase() {
  if (!dbInstance) {
    dbInstance = await sql.load('sqlite:game.db');
  }

  await dbInstance.execute(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      name VARCHAR NOT NULL,
      level INTEGER,
      class VARCHAR
    );
  `);

  console.log('✅ players table created');
  return dbInstance;
}
