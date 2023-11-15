import BuildingTableCard from "@/components/BuildingTableCard/BuildingTableCard";
import FleetArrivalCard from "@/components/FleetArrivalCard/FleetArrivalCard";
import LeaderboardCard from "@/components/LeaderboardCard/LeaderboardCard";
import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PLAYER_COLORS } from "@/utils/colors";
import { getFleetData } from "@/utils/fleetOrders";
import { getCurrentGameState, getPlayerFleets } from "@/utils/prismaUtil";
import { BUILDING_TYPE, Fleet } from "@/utils/types";
import { cache } from "react";

export const revalidate = 1800;

async function getGameState(gameNumber: string) {
  const gameState = cache(async (gameNumber: string) => {
    const item = await getCurrentGameState(gameNumber);
    return item;
  });

  return gameState(gameNumber);
}

async function getFleets(playerId: number, gameNumber: string) {
  const playerFleets = cache(async (playerId: number, gameNumber: string) => {
    const item = await getPlayerFleets(playerId, gameNumber);
    return item;
  });

  return playerFleets(playerId, gameNumber);
}

async function getFleetArrivalData(
  playerFleets: Fleet[],
  gameStateTime: number
) {
  const playerFleetData = cache(
    async (playerFleets: Fleet[], gameStateTime: number) => {
      const item = await getFleetData(playerFleets, gameStateTime);
      return item;
    }
  );

  return playerFleetData(playerFleets, gameStateTime);
}

export default async function Home() {
  if (!process.env.GAME_NUMBER) throw new Error("No game number in env");
  const gameState = await getGameState(process.env.GAME_NUMBER);
  const playerFleets = await getFleets(
    gameState.playerUid ?? -1,
    process.env.GAME_NUMBER
  );
  const fleetArrivalData = await getFleetArrivalData(
    playerFleets,
    Number(gameState.now)
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <Box className="flex flex-col">
        <LeaderboardCard
          gameName={gameState.name}
          gameTick={gameState.tick ?? -1}
          players={gameState.players}
        />
        <Box className="flex flex-row justify-between mt-6">
          <BuildingTableCard
            players={gameState.players}
            buildingType={BUILDING_TYPE.ECONOMY}
          />
          <BuildingTableCard
            players={gameState.players}
            buildingType={BUILDING_TYPE.INDUSTRY}
          />
          <BuildingTableCard
            players={gameState.players}
            buildingType={BUILDING_TYPE.SCIENCE}
          />
        </Box>
        <Box className="flex justify-between mt-6">
          <FleetArrivalCard />
        </Box>
      </Box>
    </main>
  );
}
