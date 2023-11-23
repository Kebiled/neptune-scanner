// cache this function

import { cache } from "react";
import { getCurrentGameState, getSnapshot } from "./prismaUtil";
import { PLAYER_COLORS_RBG } from "./colors";

type PlayerDatasetType = {
  [playerName: string]: {
    id: number;
    industryDataset: number[];
  };
};

async function buildPlayerDatasets({
  startTick,
  endTick,
  tickInterval,
}: {
  startTick: number;
  endTick: number;
  tickInterval: number;
}) {
  const gameNumber = process.env.GAME_NUMBER;
  const gameState = await getCurrentGameState(gameNumber ?? "");
  const players = gameState.players.map((player) => {
    return { alias: player.alias ?? "", id: String(player.uid) ?? "-1" };
  });

  let snapshots = [];
  let labels = [];
  for (let i = startTick; i < endTick; i += tickInterval) {
    const snapshot = await getSnapshot(i);
    snapshots.push(snapshot);
    labels.push(i);
  }

  // TODO: more data
  // TODO: restructure PlayerDatasetType so the dataset is indexed by a string
  const playerDatasets: PlayerDatasetType = {};
  for (const snapshot of Object.values(snapshots)) {
    for (const player of players) {
      if (!playerDatasets[player.alias]) {
        playerDatasets[player.alias] = {
          industryDataset: [],
          id: Number(player.id),
        };
      }

      const totalIndustry =
        snapshot && snapshot.players[player.id]
          ? snapshot.players[player.id].total_industry
          : 0;
      playerDatasets[player.alias].industryDataset.push(totalIndustry);
    }
  }

  return { playerDatasets, labels };
}

export async function getPlayerDatasets({
  startTick,
  endTick,
  tickInterval,
}: {
  startTick: number;
  endTick: number;
  tickInterval: number;
}) {
  const playerDatasets = cache(
    async (startTick: number, endTick: number, tickInterval: number) => {
      const item = await buildPlayerDatasets({
        startTick,
        endTick,
        tickInterval,
      });
      return item;
    }
  );

  return playerDatasets(startTick, endTick, tickInterval);
}

export async function getIndustryDataset({
  startTick,
  endTick,
  tickInterval,
}: {
  startTick: number;
  endTick: number;
  tickInterval: number;
}) {
  const { playerDatasets, labels } = await getPlayerDatasets({
    startTick,
    endTick,
    tickInterval,
  });

  let datasets = [];
  for (const playerName of Object.keys(playerDatasets)) {
    const playerData = playerDatasets[playerName];
    datasets.push({
      label: playerName,
      data: playerData.industryDataset,
      borderColor: PLAYER_COLORS_RBG[playerData.id],
      backgroundColor: PLAYER_COLORS_RBG[playerData.id],
    });
  }

  return { labels, datasets };
}
