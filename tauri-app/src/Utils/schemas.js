// Simple example schemas (can be extended or validated with a library like Ajv)

export const playerSchema = {
  id: "string", // unique id
  name: "string",
  level: "number",
  class: "string",
};

export const questSchema = {
  id: "string",
  title: "string",
  description: "string",
  completed: "boolean",
};

export const inventorySchema = {
  id: "string",
  name: "string",
  quantity: "number",
};

export const playersStart = [
  { id: 1, name: "Hero", level: 1, class: "Warrior" },
];

export const questsStart = [
  {
    id: 1,
    title: "Beginner Quest",
    description: "Slay 5 rats",
    completed: false,
  },
];

export const inventoryStart = [
  { id: 1, itemName: "Health Potion", quantity: 3 },
];
