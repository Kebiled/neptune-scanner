import BuildingTableCard from "@/components/BuildingTableCard/BuildingTableCard";
import CycleGainCard from "@/components/CycleGainCard/CycleGainCard";
import FleetArrivalCard from "@/components/FleetArrivalCard/FleetArrivalCard";
import LeaderboardCard from "@/components/LeaderboardCard/LeaderboardCard";
import TechnologyLevelCard from "@/components/TechnologyLevelCard/TechnologyLevelCard";
import Box from "@/elements/Box/Box";
import { getFleetData } from "@/utils/fleetOrders";
import { getCurrentGameState, getPlayerFleets } from "@/utils/prismaUtil";
import { playerTickComparison } from "@/utils/tickComparison";
import { BUILDING_TYPE, Fleet, FleetOrder } from "@/utils/types";
import { cache } from "react";

// TODO: React suspense and loading states
// TODO: Use tables for table data

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

async function getLastCycleComparison(currentTick: number) {
  const currentCycle = Math.floor(currentTick / 24);
  if (currentCycle === 0) return null;
  const endTick = currentCycle * 24;
  const startTick = endTick - 24;
  const cycleComparison = cache(async (startTick: number, endTick: number) => {
    const item = await playerTickComparison(startTick, endTick);
    return item;
  });

  return cycleComparison(startTick, endTick);
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
  const playerFleets = (
    await getFleets(gameState.playerUid ?? -1, process.env.GAME_NUMBER)
  ).map((fleet) => ({
    ...fleet,
    o: fleet.o ? fleet.o.filter((o): o is FleetOrder => o !== undefined) : [],
  }));
  const fleetArrivalData = await getFleetArrivalData(
    playerFleets,
    Number(gameState.now)
  );
  const cycleComparions = await getLastCycleComparison(gameState.tick ?? 0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <Box className="flex flex-col">
        <LeaderboardCard
          gameName={gameState.name}
          gameState={gameState}
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
          <FleetArrivalCard
            fleetsData={fleetArrivalData}
            players={gameState.players}
          />
        </Box>
        <Box className="flex mt-6">
          <CycleGainCard cycleComparison={cycleComparions ?? []} />
        </Box>
        <Box className="flex mt-6">
          <TechnologyLevelCard players={gameState.players} />
        </Box>
      </Box>
    </main>
  );
}
