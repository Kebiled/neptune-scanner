import { Player } from "@/utils/types";
import { headers } from "next/headers";
import prisma from "../../../../lib/prisma";
import { buildDatasets } from "@/utils/datasets";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get("apiKey");
  const gameNumber = headersList.get("gameNumber");
  const startTick = headersList.get("startTick");
  const endTick = headersList.get("endTick");
  const tickInterval = headersList.get("tickInterval");
  if (!gameNumber || !apiKey)
    return new Response(
      `${!apiKey ? "Api Key" : "Game Number"} not passed in through headers`,
      {
        status: 400,
      }
    );

  if (!startTick || !endTick || !tickInterval)
    return new Response(
      `startTick, endTick, or tickInterval not passed in through headers`,
      {
        status: 400,
      }
    );

  const datasets = await buildDatasets({
    gameNumber: gameNumber,
    startTick: Number(startTick),
    endTick: Number(endTick),
    tickInterval: Number(tickInterval),
  });
  return Response.json(datasets);
}
