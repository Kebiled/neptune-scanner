"use client";

import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { Player } from "@/utils/types";
import FleetArrivalRow from "./FleetArrivalRow";
import { getApiKey, getGameNumber, getPlayerId } from "@/app/page";
import { usePlayerFleets } from "@/utils/dataHooks";

// TODO: find somewhere for this to live
const PLAYERS = [
  "SCHLONGCOPTER",
  "WetTortilla",
  "Emperor Yeezy",
  "Skinno Peepe",
  "Tomato juice", // TOMATO JUICE - 4
  "red-600", // O D O PISS - 5
  "fuchsia-500", // HOT MILKY - 6
];

// TODO: add amount of ships in fleet, amount of ships on target planet add battle calc
export default function FleetArrivalCard() {
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
      <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
        <Text className="text-black">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
      <Text className="text-black font-bold text-lg">Fleet Arrival</Text>
      <Box className="mt-10 mb-5">
        <Box className="flex flex-row justify-between">
          <Box className="w-1/5">
            <Text className="text-black font-bold">Star Name</Text>
          </Box>
          <Box className="flex w-1/5">
            <Box className={`my-auto mr-2 rounded-full w-4 h-4`} />
            <Text className="text-black font-bold">Owned By</Text>
          </Box>
          <Box className="w-1/6">
            <Text className="text-black font-bold">Fleet Str.</Text>
          </Box>
          <Box className="w-1/6">
            <Text className="text-black font-bold">Star Str.</Text>
          </Box>
          <Box className="w-1/5">
            <Text className="text-black font-bold">Time Left</Text>
          </Box>
        </Box>
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
      </Box>
    </Box>
  );
}
