import BuildingTableCard from "@/components/BuildingTableCard/BuildingTableCard";
import CycleGainCard from "@/components/CycleGainCard/CycleGainCard";
import FleetArrivalCard from "@/components/FleetArrivalCard/FleetArrivalCard";
import IndustryCard from "@/components/IndustryCard/IndustryCard";
// import IndustryChartCard from "@/components/IndustryChartCard/IndustryChartCard";
import LeaderboardCard from "@/components/LeaderboardCard/LeaderboardCard";
import { SWRProvider } from "@/components/SWRProvider/SWRProvider";
import TechnologyLevelCard from "@/components/TechnologyLevelCard/TechnologyLevelCard";
import Box from "@/elements/Box/Box";
import { getCurrentGameState, getPlayerFleets } from "@/utils/prismaUtil";
import { BUILDING_TYPE, Fleet, FleetOrder } from "@/utils/types";
import { cache } from "react";

// TODO: run db update script on T2 micro
// TODO: login
// TODO: add games to user db
// TODO: Mobile Friendly
// TODO: Use tables for table data
// TODO: change fleet arrival data to only deliver fleets headed to enemy or empty planets
// TODO: Enemy fleet arrival
// TODO: create combat calculator for fleet arrival table with ship production included and fleet drop off / add
// TODO: current research tech, how long, next research tech, and how long it'd take to research any others
// TODO: how much money you will earn next cycle
// TODO: look into prisma proxy connections
// TODO: calculator tab with industry / combat etc

export const revalidate = 300;

// TODO: move to swr
async function getGameState(gameNumber: string) {
  const gameState = cache(async (gameNumber: string) => {
    const item = await getCurrentGameState(gameNumber);
    return item;
  });

  return gameState(gameNumber);
}

export default async function Home() {
  if (!process.env.GAME_NUMBER) throw new Error("No game number in env");
  const gameState = await getGameState(process.env.GAME_NUMBER);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <SWRProvider>
        <Box className="flex flex-col gap-y-6">
          <LeaderboardCard
            gameName={gameState.name}
            gameState={gameState}
            gameTick={gameState.tick ?? -1}
          />
          <Box className="flex flex-row justify-between">
            <BuildingTableCard buildingType={BUILDING_TYPE.ECONOMY} />
            <BuildingTableCard buildingType={BUILDING_TYPE.INDUSTRY} />
            <BuildingTableCard buildingType={BUILDING_TYPE.SCIENCE} />
          </Box>
          <IndustryCard />
          <CycleGainCard />
          <TechnologyLevelCard />
          <FleetArrivalCard />
          {/* <IndustryChartCard /> */}
        </Box>
      </SWRProvider>
    </main>
  );
}
