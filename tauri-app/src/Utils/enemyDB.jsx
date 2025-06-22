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
 * Create a new enemy
 */
export async function createEnemy({ name, health, defense, difficulty, type, image }) {
  const db = await getDb();
  await db.execute(
    `INSERT INTO enemy (name, health, defense, difficulty, type, image) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, health, defense, difficulty, type, image]
  );
}

/**
 * Read all enemies
 */
export async function getAllEnemies() {
  const db = await getDb();
  const enemies = await db.select(`SELECT * FROM enemy`);
  return enemies;
}

/**
 * Read a single enemy by ID
 */
export async function getEnemyById(id) {
  const db = await getDb();
  const [enemy] = await db.select(`SELECT * FROM enemy WHERE id = ?`, [id]);
  return enemy || null;
}

/**
 * Update an enemy by ID
 */
export async function updateEnemy(id, { name, health, defense, difficulty, type, image }) {
  const db = await getDb();
  await db.execute(
    `UPDATE enemy SET name = ?, health = ?, defense = ?, difficulty = ?, type = ?, image = ? WHERE id = ?`,
    [name, health, defense, difficulty, type, image, id]
  );
}

/**
 * Delete an enemy by ID
 */
export async function deleteEnemy(id) {
  const db = await getDb();
  await db.execute(`DELETE FROM enemy WHERE id = ?`, [id]);
}
