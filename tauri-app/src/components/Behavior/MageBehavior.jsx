export const MageBehavior = (enemy, setPlayerHealth, playerHealth) => {
    setPlayerHealth(prev => Math.max(prev - 5, 0))
}