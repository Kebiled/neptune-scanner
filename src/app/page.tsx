import BuildingTableCard from "@/components/BuildingTableCard/BuildingTableCard";
import CycleGainCard from "@/components/CycleGainCard/CycleGainCard";
import FleetArrivalCard from "@/components/FleetArrivalCard/FleetArrivalCard";
import IndustryCard from "@/components/IndustryCard/IndustryCard";
// import IndustryChartCard from "@/components/IndustryChartCard/IndustryChartCard";
import LeaderboardCard from "@/components/LeaderboardCard/LeaderboardCard";
import TechnologyLevelCard from "@/components/TechnologyLevelCard/TechnologyLevelCard";
import Box from "@/elements/Box/Box";
import { getIndustryDataset } from "@/utils/datasets";
import {
  getFleetArrivalData,
  getFleets,
  getGameState,
  getLastCycleComparison,
} from "@/utils/prismaUtil";
import { BUILDING_TYPE, Fleet, FleetOrder } from "@/utils/types";

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
  const cycleComparions = await getLastCycleComparison(
    gameState.tick ? gameState.tick - (gameState.tick % 24) : 0
  );
  // const chartData = await getIndustryDataset({
  //   startTick: 0,
  //   endTick: gameState.tick ?? 0,
  //   tickInterval: 4,
  // });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <Box className="flex flex-col gap-y-6">
        <LeaderboardCard
          gameName={gameState.name}
          gameState={gameState}
          gameTick={gameState.tick ?? -1}
          players={gameState.players}
        />
        <Box className="flex flex-row justify-between">
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
        <IndustryCard players={gameState.players} />
        {/* TODO: toggle show this */}
        <FleetArrivalCard
          fleetsData={fleetArrivalData}
          players={gameState.players}
        />
        <CycleGainCard cycleComparison={cycleComparions ?? []} />
        <TechnologyLevelCard players={gameState.players} />
        {/* <IndustryChartCard data={chartData} /> */}
      </Box>
    </main>
  );
}
