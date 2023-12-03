"use client";

import Box from "@/elements/Box/Box";
import FleetArrivalRow from "./FleetArrivalRow";
import {
  getApiKey,
  getGameNumber,
  getPlayerId,
  usePlayerFleets,
} from "@/utils/dataHooks";

export default function FleetArrivalCardContent() {
  const apiKey = getApiKey();
  const gameNumber = getGameNumber();
  const playerId = getPlayerId();
  const { fleets, isLoading, isError } = usePlayerFleets(
    gameNumber,
    apiKey,
    playerId
  );

  if (isLoading || !fleets) {
    return (
      <Box className="w-full h-[300px] bg-slate-300 rounded-md px-3 pt-3 animate-pulse" />
    );
  }

  return (
    <>
      {fleets
        .filter((fleet) => fleet && fleet.arrivalDate)
        .map((fleet) => {
          return {
            ...fleet,
            arrivalDate: new Date(fleet?.arrivalDate ?? -1),
          };
        })
        .sort(
          (a, b) =>
            new Date(a?.arrivalDate).getTime() -
            new Date(b?.arrivalDate).getTime()
        )
        .map((fleetData) => {
          if (!fleetData?.arrivalDate) return null;
          return (
            <FleetArrivalRow
              key={fleetData?.arrivalDate?.getTime()}
              fleetData={fleetData}
              arrivalDate={fleetData.arrivalDate}
            />
          );
        })}
    </>
  );
}
