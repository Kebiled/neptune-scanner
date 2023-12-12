import { Game, Player } from "@/utils/types";
import { headers } from "next/headers";
import prisma from "../../../../lib/prisma";
import { playerTickComparison } from "@/utils/tickComparison";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get("apiKey");
  const gameNumber = headersList.get("gameNumber");
  if (!gameNumber || !apiKey)
    return new Response(
      `${!apiKey ? "Api Key" : "Game Number"} not passed in through headers`,
      {
        status: 400,
      }
    );

  const gameState = (await prisma.game.findUnique({
    where: {
      gameNumber,
    },
  })) as Game;

  // TODO: actual error handling here if you cant get the tick
  const currentTick = gameState.tick ?? 0;
  const currentCycle = Math.floor(currentTick / 24);
  if (currentCycle === 0) {
    await prisma.$disconnect;
    return Response.json({ message: "Waiting for first cycle to complete..." });
  }
  const endTick = currentCycle * 24;
  const startTick = endTick - 24;
  const cycleComparison = await playerTickComparison(startTick, endTick);

  await prisma.$disconnect;
  return Response.json(cycleComparison);
}
