"use client";

import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PLAYER_COLORS } from "@/utils/colors";
import { getNextCycleDate } from "@/utils/time";
import { Game, Player } from "@/utils/types";
import LeaderboardProductionCycle from "./LeaderboardProductionCycle";
import { getApiKey, getGameNumber, usePlayers } from "@/utils/dataHooks";

type LeaderboardCardProps = {
  gameName: string;
  gameState: Game;
  gameTick: number;
};

export default function LeaderboardCard({
  gameName,
  gameState,
  gameTick,
}: LeaderboardCardProps) {
  const cycleDate = getNextCycleDate(gameState);

  const apiKey = getApiKey();
  const gameNumber = getGameNumber();
  const { players, isLoading, isError } = usePlayers(gameNumber, apiKey);

  if (isLoading) {
    return (
      <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
        <Text className="text-black">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
      <Box className="flex justify-between">
        <Box className="w-1/4">
          <Text className="text-black font-bold text-lg">{gameName}</Text>
        </Box>
        {!!cycleDate ? (
          <LeaderboardProductionCycle cycleDate={cycleDate} />
        ) : null}
        <Box className="w-1/4">
          <Text className="text-black font-bold text-lg">
            Cycle: {`${Math.floor(gameTick / 24)}`} Tick: {`${gameTick}`}
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-col mt-10 mb-5">
        {players
          ? players
              .sort((a, b) => (b.totalStars || 0) - (a.totalStars || 0))
              .map((player, idx) => {
                return (
                  <Box
                    className={`flex flex-row justify-between bg-${
                      PLAYER_COLORS[player.playerId]
                    } px-3`}
                    key={player.playerId}
                  >
                    <Box className="w-3/6">
                      <Text className={`text-white`}>{player.alias}</Text>
                    </Box>
                    <Box className="w-1/6">
                      <Text className="text-white ml-3">
                        Stars: {`${player.totalStars}`}
                      </Text>
                    </Box>
                    <Box className="w-1/6">
                      <Text className="text-white ml-3">
                        Fleets: {`${player.totalFleets}`}
                      </Text>
                    </Box>
                    <Box className="w-1/6">
                      <Text className="text-white ml-3">
                        Ships: {`${player.totalStrength}`}
                      </Text>
                    </Box>
                  </Box>
                );
              })
          : null}
      </Box>
    </Box>
  );
}
