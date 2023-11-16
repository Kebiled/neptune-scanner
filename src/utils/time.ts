import { Game } from "./types";

const TICK_LENGTH_MILLISECONDS = 3600000;
const TICKS_PER_CYCLE = 24;

export function getNextCycleDate(gameState: Game) {
  const cycleLength = TICKS_PER_CYCLE;
  const cycleProgress = gameState.productionCounter;
  const tickProgress = gameState.tickFragment;
  const timeOfData = Number(gameState.now);
  const currentTick = gameState.tick;

  if (
    (!cycleLength && cycleLength !== 0) ||
    (!cycleProgress && cycleProgress !== 0) ||
    (!tickProgress && tickProgress !== 0) ||
    (!timeOfData && timeOfData !== 0) ||
    (!currentTick && currentTick !== 0)
  )
    return null;

  const ticksTillNextCycle = cycleLength - (cycleProgress + tickProgress);
  const millisecondsTillNextCycle =
    ticksTillNextCycle * TICK_LENGTH_MILLISECONDS;
  const timeOfNextCycle = timeOfData + millisecondsTillNextCycle;
  return new Date(timeOfNextCycle);
}
