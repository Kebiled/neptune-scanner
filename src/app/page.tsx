import BuildingTableCard from "@/components/BuildingTableCard/BuildingTableCard";
import CycleGainCard from "@/components/CycleGainCard/CycleGainCard";
import FleetArrivalCard from "@/components/FleetArrivalCard/FleetArrivalCard";
import IndustryCard from "@/components/IndustryCard/IndustryCard";
// import IndustryChartCard from "@/components/IndustryChartCard/IndustryChartCard";
import LeaderboardCard from "@/components/LeaderboardCard/LeaderboardCard";
import { SWRProvider } from "@/components/SWRProvider/SWRProvider";
import TechnologyLevelCard from "@/components/TechnologyLevelCard/TechnologyLevelCard";
import Box from "@/elements/Box/Box";
import RefreshButton from "@/elements/RefreshButton/RefreshButton";
import { getIndustryDataset } from "@/utils/datasets";
import { getFleetData } from "@/utils/fleetOrders";
import { getCurrentGameState, getPlayerFleets } from "@/utils/prismaUtil";
import { playerTickComparison } from "@/utils/tickComparison";
import { BUILDING_TYPE, Fleet, FleetOrder } from "@/utils/types";
import { cache } from "react";

// TODO: React suspense and loading states
// TODO: run db poller on T2 micro
// TODO: Mobile Friendly
// TODO: Use tables for table data
// TODO: Ships / day
// TODO: create combat calculator for fleet arrival table with ship generator
// TODO: Enemy fleet arrival
// TODO: current research tech, how long, next research tech, and how long it'd take to research any others
// TODO: Replicate data tables from game
// TODO: how much money you will earn next cycle
// TODO: look into prisma proxy connections

export const revalidate = 300;

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
  // const playerFleets = (
  //   await getFleets(gameState.playerUid ?? -1, process.env.GAME_NUMBER)
  // ).map((fleet) => ({
  //   ...fleet,
  //   o: fleet.o ? fleet.o.filter((o): o is FleetOrder => o !== undefined) : [],
  // }));
  // const fleetArrivalData = await getFleetArrivalData(
  //   playerFleets,
  //   Number(gameState.now)
  // );
  // const cycleComparions = await getLastCycleComparison(
  //   gameState.tick ? gameState.tick - (gameState.tick % 24) : 0
  // );
  // const chartData = await getIndustryDataset({
  //   startTick: 0,
  //   endTick: gameState.tick ?? 0,
  //   tickInterval: 4,
  // });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <Box className="flex flex-col gap-y-6">
        {/* <RefreshButton /> */}
        <SWRProvider>
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
        </SWRProvider>

        {/* TODO: toggle show this */}
        {/* 
        
        <TechnologyLevelCard players={gameState.players} /> */}
        {/* <IndustryChartCard data={chartData} /> */}
      </Box>
    </main>
  );
}
