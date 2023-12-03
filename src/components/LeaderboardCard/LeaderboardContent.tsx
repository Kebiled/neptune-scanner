"use client";

import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PLAYER_COLORS } from "@/utils/colors";
import { getApiKey, getGameNumber, usePlayers } from "@/utils/dataHooks";

export default function LeaderboardContent() {
  const apiKey = getApiKey();
  const gameNumber = getGameNumber();
  const { players, isLoading, isError } = usePlayers(gameNumber, apiKey);

  if (isLoading || !players) {
    return (
      <Box className="w-full h-[200px] bg-slate-300 rounded-md flex flex-col mt-10 mb-5 animate-pulse" />
    );
  }

  return (
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
  );
}
