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
 * Create a new item
 */
export async function createItem({ name, image = null, type, rarity }) {
  const db = await getDb();
  await db.execute(
    `INSERT INTO items (name, image, type, rarity) VALUES (?, ?, ?, ?)`,
    [name, image, type, rarity]
  );
}

/**
 * Read all items
 */
export async function getAllItems() {
  const db = await getDb();
  const items = await db.select(`SELECT * FROM items`);
  return items;
}

/**
 * Read a single item by ID
 */
export async function getItemById(id) {
  const db = await getDb();
  const [item] = await db.select(`SELECT * FROM items WHERE id = ?`, [id]);
  return item || null;
}

/**
 * Update an item by ID
 */
export async function updateItem(id, { name, image = null, type, rarity }) {
  const db = await getDb();
  await db.execute(
    `UPDATE items SET name = ?, image = ?, type = ?, rarity = ? WHERE id = ?`,
    [name, image, type, rarity, id]
  );
}

/**
 * Delete an item by ID
 */
export async function deleteItem(id) {
  const db = await getDb();
  await db.execute(`DELETE FROM items WHERE id = ?`, [id]);
}
