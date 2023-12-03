"use client";

import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import TechnologyLevelCol from "./TechnologyLevelCol";
import { getApiKey, getGameNumber, usePlayers } from "@/utils/dataHooks";

export default function TechnologyLevelCardContent() {
  const apiKey = getApiKey();
  const gameNumber = getGameNumber();
  const { players, isLoading, isError } = usePlayers(gameNumber, apiKey);

  if (isLoading) {
    return (
      <Box className="w-full h-auto bg-slate-300 rounded-md px-3 pt-3 animate-pulse" />
    );
  }
  return (
    <>
      {players.map((player) => {
        if (!player) return null;
        return <TechnologyLevelCol key={player.playerId} player={player} />;
      })}
    </>
  );
}
