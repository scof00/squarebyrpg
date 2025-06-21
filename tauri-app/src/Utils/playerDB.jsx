
import sql from '@tauri-apps/plugin-sql';

let dbInstance;

/**
 * Initialize the database connection (singleton)
 */
async function getDb() {
  if (!dbInstance) {
    dbInstance = await sql.load('sqlite:game.db');
  }
  return dbInstance;
}

/**
 * Create a new player
 */
export async function createPlayer({ name, level, className }) {
  const db = await getDb();
  await db.execute(
    `INSERT INTO players (name, level, class) VALUES (?, ?, ?)`,
    [name, level, className]
  );
}

/**
 * Read all players
 */
export async function getAllPlayers() {
  const db = await getDb();
  const players = await db.select(`SELECT * FROM players`);
  return players;
}

/**
 * Read a single player by ID
 */
export async function getPlayerById(id) {
  const db = await getDb();
  const [player] = await db.select(`SELECT * FROM players WHERE id = ?`, [id]);
  return player || null;
}

/**
 * Update a player's data by ID
 */
export async function updatePlayer(id, { name, level, className }) {
  const db = await getDb();
  await db.execute(
    `UPDATE players SET name = ?, level = ?, class = ? WHERE id = ?`,
    [name, level, className, id]
  );
}

/**
 * Delete a player by ID
 */
export async function deletePlayer(id) {
  const db = await getDb();
  await db.execute(`DELETE FROM players WHERE id = ?`, [id]);
}
