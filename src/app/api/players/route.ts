import { Player } from "@/utils/types";
import { headers } from "next/headers";
import prisma from "../../../../lib/prisma";

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
  const players = (await prisma.player.findMany({
    where: {
      gameId: gameNumber,
    },
  })) as Player[];

  await prisma.$disconnect;
  return Response.json(players);
}
