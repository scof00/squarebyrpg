export const SmudgeBehavior = (enemy, setPlayerHealth, playerHealth) => {
    setPlayerHealth(prev => Math.max(prev - 5, 0))
}