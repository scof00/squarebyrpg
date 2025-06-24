// utils/attackModification.js
export function modifyAttack(baseDamage) {
  const breakdown = [];
  let total = baseDamage;

  const inventory = ["Fire Amulet", "Sharp Blade"];

  //Static additions first, then multipliers in the second part.

  if (inventory.includes("Fire Amulet")) {
    breakdown.push("Fire Amulet: +3");
    total += 3;
  }

  if (inventory.includes("Sharp Blade")) {
    breakdown.push("Sharp Blade: +2");
    total += 2;
  }

  return { breakdown, total };
}
