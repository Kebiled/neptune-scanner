import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { getCurrentGameState } from "@/utils/prismaUtil";
import { Game } from "@/utils/types";
import { cache } from "react";

export const revalidate = 60;

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
      <Box className="w-[800px] min-h-[400px] bg-slate-200 rounded-md">
        <Text className="text-black ">{gameState.name}</Text>
        <Box className="flex flex-col mt-20">
          {gameState.players.map((player) => {
            return (
              <Box
                className="flex flex-row justify-between"
                key={player.playerId}
              >
                <Text className="text-black">{player.alias}</Text>
                <Text className="text-black ml-3">
                  Total Stars: {`${player.totalStars}`}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </main>
  );
}
