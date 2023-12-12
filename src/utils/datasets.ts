// cache this function

import { Player } from "@prisma/client";
import { getCurrentGameState, getSnapshot } from "./prismaUtil";
import { SnapshotPlayer } from "./types";

export type SnapshotDatasetType = {
  name: number;
  [key: number]: number | null | undefined;
};

export type DatasetType = {
  data: SnapshotDatasetType[];
};

export type DatasetsType = {
  industry: DatasetType;
  economy: DatasetType;
  science: DatasetType;
  stars: DatasetType;
  ships: DatasetType;
};

export async function buildDatasets({
  gameNumber,
  startTick,
  endTick,
  tickInterval,
}: {
  gameNumber: string;
  startTick: number;
  endTick: number;
  tickInterval: number;
}) {
  // const gameState = await getCurrentGameState(gameNumber);
  // const players = gameState.players.map((player) => {
  //   return { alias: player.alias ?? "", id: player.uid ?? -1 };
  // });

  // TODO: batch prisma transactions then sort by snapshot id?
  let snapshots = [];
  for (let i = startTick; i <= endTick; i += tickInterval) {
    const snapshot = await getSnapshot(i);
    // TODO: parse players

    if (snapshot) {
      const players: SnapshotPlayer[] = snapshot.players;
      snapshots.push({ ...snapshot, players: players });
    }
  }

  const industryDataset: DatasetType = { data: [] };
  const economyDataset: DatasetType = { data: [] };
  const scienceDataset: DatasetType = { data: [] };
  const starsDataset: DatasetType = { data: [] };
  const shipsDataset: DatasetType = { data: [] };

  for (const snapshot of snapshots) {
    const industrySnapshotData: SnapshotDatasetType = { name: snapshot.tick };
    const economySnapshotData: SnapshotDatasetType = { name: snapshot.tick };
    const scienceSnapshotData: SnapshotDatasetType = { name: snapshot.tick };
    const starsSnapshotData: SnapshotDatasetType = { name: snapshot.tick };
    const shipsSnapshotData: SnapshotDatasetType = { name: snapshot.tick };
    for (const player of Object.values(snapshot.players)) {
      if (player.uid || player.uid === 0) {
        industrySnapshotData[player.uid as number] =
          snapshot.players[player.uid].total_industry;
        economySnapshotData[player.uid as number] =
          snapshot.players[player.uid].total_economy;
        scienceSnapshotData[player.uid as number] =
          snapshot.players[player.uid].total_science;
        starsSnapshotData[player.uid as number] =
          snapshot.players[player.uid].total_stars;
        shipsSnapshotData[player.uid as number] =
          snapshot.players[player.uid].total_strength;
      }
    }
    industryDataset.data.push(industrySnapshotData);
    economyDataset.data.push(economySnapshotData);
    scienceDataset.data.push(scienceSnapshotData);
    starsDataset.data.push(starsSnapshotData);
    shipsDataset.data.push(shipsSnapshotData);
  }

  return {
    industry: industryDataset,
    economy: economyDataset,
    science: scienceDataset,
    stars: starsDataset,
    ships: shipsDataset,
  };
}
