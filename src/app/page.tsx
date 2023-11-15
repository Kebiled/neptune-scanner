import BuildingTableCard from "@/components/BuildingTableCard/BuildingTableCard";
import LeaderboardCard from "@/components/LeaderboardCard/LeaderboardCard";
import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PLAYER_COLORS } from "@/utils/colors";
import { getCurrentGameState } from "@/utils/prismaUtil";
import { BUILDING_TYPE } from "@/utils/types";
import { cache } from "react";

export const revalidate = 1800;

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
  // console.log(gameState.fleets);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <Box className="flex flex-col">
        <LeaderboardCard
          gameName={gameState.name}
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
      </Box>
    </main>
  );
}
