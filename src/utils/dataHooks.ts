"use client";

import useSWR from "swr";
import { CycleComparison, Fleet, FleetArrivalData, Player } from "./types";

const fetcherWithHeaders = async ([url, headers]: [string, any]) => {
  const response = await fetch(url, headers);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export function usePlayers(gameNumber: string, apiKey: string) {
  const headers = {
    headers: {
      gameNumber: gameNumber,
      apiKey: apiKey,
    },
  };
  const { data, error, isLoading } = useSWR(
    [`/api/players`, headers],
    fetcherWithHeaders
  );

  return {
    players: data as Player[],
    isLoading,
    isError: error,
  };
}

export function usePlayerFleets(
  gameNumber: string,
  apiKey: string,
  playerId: number
) {
  const headers = {
    headers: {
      gameNumber: gameNumber,
      apiKey: apiKey,
      playerId: String(playerId),
    },
  };

  const { data, error, isLoading } = useSWR(
    [`/api/fleetArrivalData`, headers],
    fetcherWithHeaders
  );

  return {
    fleets: data as FleetArrivalData[],
    isLoading,
    isError: error,
  };
}

export function useLastCycleComparison(gameNumber: string, apiKey: string) {
  const headers = {
    headers: {
      gameNumber: gameNumber,
      apiKey: apiKey,
    },
  };
  const { data, error, isLoading } = useSWR(
    [`/api/lastCycleComparison`, headers],
    fetcherWithHeaders
  );

  return {
    cycleComparison: (data as CycleComparison) ?? [],
    isLoading,
    isError: error,
  };
}
