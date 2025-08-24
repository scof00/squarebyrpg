export const createRollDie = (setDiceValues, playDiceSound) => {
  return (index, delay = 60, blocked = []) =>
    new Promise((resolve) => {
      if (!setDiceValues || typeof setDiceValues !== "function") {
        throw new Error("setDiceValues must be passed to createRollDie!");
      }

      let rollCount = 0;
      const maxRolls = 10;
      const interval = setInterval(() => {
        let val;
        do {
          val = Math.ceil(Math.random() * 6);
        } while (blocked.includes(val));

        // update UI dice - keep the object structure
        setDiceValues((prev) => {
          const updated = [...prev];
          updated[index] = { value: val, isExploded: false };
          return updated;
        });

        // play sound only once
        if (rollCount === 0) playDiceSound?.();

        rollCount++;
        if (rollCount >= maxRolls) {
          clearInterval(interval);
          resolve(val);
        }
      }, delay);

      setTimeout(() => {
        clearInterval(interval);
        resolve(Math.ceil(Math.random() * 6));
      }, 1000);
    });
};

export async function modifyAttack(rollDie) {
  const breakdown = [];
  const results = [];
  let modifiedResults = [];

  const inventory = [
    "Deux Die Doubler",
    "Eeps all Evens",
    "No Ones",
    "Gleaming Blade",
    "NSBU",
  ];

  //Dice roll and dice modifiers
  for (let i = 0; i < 3; i++) {
    const blockedNumbers = [];
    if (inventory.includes("No Ones")) blockedNumbers.push(1);
    if (inventory.includes("Oops all Odds")) blockedNumbers.push(2, 4, 6);
    if (inventory.includes("Eeps all Evens")) blockedNumbers.push(1, 3, 5);

    let result = await rollDie(i, 60, blockedNumbers);
    results.push({ value: result, isExploded: false }); // Track explosion status

    if (inventory.includes("NSBU")) {
      while (result === 6) {
        const extra = Math.ceil(Math.random() * 6);
        results.push({ value: extra, isExploded: true }); // Mark as exploded
        breakdown.push(`NSBU triggered: +${extra}`);
        result = extra; // check if this one also explodes
      }
    }
  }

  // Extract values for calculations but keep original structure for rendering
  const values = results.map(dieData => dieData.value);
  modifiedResults = [...values];

  if (
    inventory.includes("Deux Die Doubler") &&
    modifiedResults[1] !== undefined
  ) {
    const original = modifiedResults[1];
    modifiedResults[1] *= 2;
    breakdown.push(`Deux Die Doubler: ${original} → ${modifiedResults[1]}`);
  }

  let total = modifiedResults.reduce((a, b) => a + b, 0);

  // Static additive modifiers
  if (inventory.includes("Whetstone")) {
    breakdown.push("Whetstone: +1");
    total += 1;
  }
  if (inventory.includes("Improved Whetstone")) {
    breakdown.push("Improved Whetstone: +2");
    total += 2;
  }
  if (inventory.includes("Master Whetstone")) {
    breakdown.push("Master Whetstone: +3");
    total += 3;
  }
  //Multiplicative Modifiers
  if (inventory.includes("Gleaming Blade")) {
    breakdown.push(`Gleaming Blade: ${total} → ${total * 2}`);
    total *= 2;
  }

  return { results, breakdown, total }; // results still contains the object structure for rendering
}