import { FleetOrder, Game, Player } from "@/utils/types";
import { headers } from "next/headers";
import prisma from "../../../../lib/prisma";
import { getFleetData, processDBOrder } from "@/utils/fleetOrders";
import { getPlayerFleets } from "@/utils/prismaUtil";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

export async function GET(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get("apiKey");
  const gameNumber = headersList.get("gameNumber");
  const playerId = headersList.get("playerId");
  if (!gameNumber || !apiKey || !playerId)
    return new Response(
      `${
        !apiKey ? "Api Key" : !playerId ? "Player ID" : "Game Number"
      } not passed in through headers`,
      {
        status: 400,
      }
    );

  const gameState = (await prisma.game.findUnique({
    where: {
      gameNumber,
    },
  })) as Game;

  const processedFleets = (
    await getPlayerFleets(Number(playerId), gameNumber)
  ).map((fleet) => ({
    ...fleet,
    o: fleet.o ? fleet.o.filter((o): o is FleetOrder => o !== undefined) : [],
  }));

  const fleetArrivalData = await getFleetData(
    processedFleets,
    Number(gameState.now)
  );

  await prisma.$disconnect();
  return Response.json(fleetArrivalData);
}
