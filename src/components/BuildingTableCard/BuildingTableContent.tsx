"use client";

import { BUILDING_TYPE, Player } from "@/utils/types";
import Text from "@/elements/Text/Text";
import Box from "@/elements/Box/Box";
import { PlayerColorCircle } from "@/elements/PlayerColorCircle/PlayerColorCircle";
import { getApiKey, getGameNumber, usePlayers } from "@/utils/dataHooks";

function sortPlayers(players: Player[], buildingType: BUILDING_TYPE) {
  switch (buildingType) {
    case BUILDING_TYPE.ECONOMY:
      return players.sort(
        (a, b) => (b.totalEconomy || 0) - (a.totalEconomy || 0)
      );
    case BUILDING_TYPE.INDUSTRY:
      return players.sort(
        (a, b) => (b.totalIndustry || 0) - (a.totalIndustry || 0)
      );
    case BUILDING_TYPE.SCIENCE:
      return players.sort(
        (a, b) => (b.totalScience || 0) - (a.totalScience || 0)
      );
  }
}

function getPlayerBuildingValue(player: Player, buildingType: BUILDING_TYPE) {
  switch (buildingType) {
    case BUILDING_TYPE.ECONOMY:
      return player.totalEconomy;
    case BUILDING_TYPE.INDUSTRY:
      return player.totalIndustry;
    case BUILDING_TYPE.SCIENCE:
      return player.totalScience;
  }
}

interface BuildingTableContentProps {
  buildingType: BUILDING_TYPE;
}

export default function BuildingTableContent({
  buildingType,
}: BuildingTableContentProps) {
  const apiKey = getApiKey();
  const gameNumber = getGameNumber();
  const { players, isLoading, isError } = usePlayers(gameNumber, apiKey);

  if (isLoading) {
    return (
      <Box className="w-full h-[200px] bg-slate-300 rounded-md animate-pusle" />
    );
  }

  return (
    <Box className="flex flex-col mt-10 mb-5">
      {sortPlayers(players, buildingType).map((player) => {
        return (
          <Box
            className={`flex flex-row justify-between px-1`}
            key={player.playerId}
          >
            <Box className="flex">
              <PlayerColorCircle playerId={player.playerId} />
              <Text className={`text-black`}>{player.alias}</Text>
            </Box>
            <Text className="text-black ml-3">{`${getPlayerBuildingValue(
              player,
              buildingType
            )}`}</Text>
          </Box>
        );
      })}
    </Box>
  );
}
