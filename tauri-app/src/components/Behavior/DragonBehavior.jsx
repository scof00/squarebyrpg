export const DragonBehavior = (enemy, setPlayerHealth, playerHealth) => {
    setPlayerHealth(prev => Math.max(prev - 5, 0))
}