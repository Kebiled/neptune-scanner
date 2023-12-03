"use client";

import Box from "@/elements/Box/Box";
import CycleGainCol from "./CycleGainCol";
import {
  getApiKey,
  getGameNumber,
  useLastCycleComparison,
} from "@/utils/dataHooks";

export default function CycleGainContent() {
  const apiKey = getApiKey();
  const gameNumber = getGameNumber();
  const { cycleComparison, isLoading, isError } = useLastCycleComparison(
    gameNumber,
    apiKey
  );

  if (isLoading || !cycleComparison) {
    return (
      <Box className="flex w-full h-auto bg-slate-300 rounded-md px-3 pt-3 animate-pulse" />
    );
  }

  return (
    <>
      {cycleComparison.map((playerComparison) => {
        if (!playerComparison) return null;
        return (
          <CycleGainCol
            key={playerComparison.playerId}
            playerComparison={playerComparison}
          />
        );
      })}
    </>
  );
}
