import { getSnapshot } from "./prismaUtil";
import { Player } from "./types";

// TODO: remove WetTortilla harcodes
// TODO: add research increases
export async function playerTickComparison(startTick: number, endTick: number) {
  const startSnapshot = await getSnapshot(startTick);
  const endSnapshot = await getSnapshot(endTick);
  const startPlayersObject = startSnapshot?.players;
  const endPlayersObject = endSnapshot?.players;

  const startPlayersKeys = Object.keys(startPlayersObject);
  const endPlayersKeys = Object.keys(endPlayersObject);

  if (!startPlayersKeys) return [];

  const comparisons = startPlayersKeys.map((startPlayerKey) => {
    const startPlayer = startPlayersObject[startPlayerKey];
    const endPlayerKey = endPlayersKeys.find(
      (endPlayerKey) =>
        endPlayersObject[endPlayerKey].alias ===
        (startPlayer.alias ? startPlayer.alias : "WetTortilla")
    );
    if (!endPlayerKey) return null;
    const endPlayer = endPlayersObject[endPlayerKey];
    return {
      alias: startPlayer.alias ? startPlayer.alias : "WetTortilla",
      playerId: startPlayer.uid,
      starGain:
        endPlayer?.total_stars && startPlayer.total_stars
          ? endPlayer.total_stars - startPlayer.total_stars
          : 0,
      shipsGain:
        endPlayer?.total_strength && startPlayer.total_strength
          ? endPlayer.total_strength - startPlayer.total_strength
          : 0,
      economyGain:
        endPlayer?.total_economy && startPlayer.total_economy
          ? endPlayer.total_economy - startPlayer.total_economy
          : 0,
      industryGain:
        endPlayer?.total_industry && startPlayer.total_industry
          ? endPlayer.total_industry - startPlayer.total_industry
          : 0,
      scienceGain:
        endPlayer?.total_science && startPlayer.total_science
          ? endPlayer.total_science - startPlayer.total_science
          : 0,
    };
  });
  return comparisons.filter((c) => c);
}
