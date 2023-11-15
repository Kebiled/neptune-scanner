import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { Player } from "@/utils/types";
import FleetArrivalRow from "./FleetArrivalRow";

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

type FleetArrivalCardProps = {
  fleetsData: ({
    starName: string | null | undefined;
    ownedBy: number | null | undefined;
    arrivalDate: Date | null | undefined;
  } | null)[];
  players: Player[];
};

// TODO: add amount of ships in fleet, amount of ships on target planet add battle calc
export default function FleetArrivalCard({
  fleetsData,
  players,
}: FleetArrivalCardProps) {
  return (
    <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
      <Text className="text-black font-bold text-lg">Fleet Arrival</Text>
      <Box className="mt-10">
        {fleetsData
          .filter((fleetData) => fleetData && fleetData.arrivalDate)
          .sort(
            (a, b) =>
              (a?.arrivalDate as Date).getTime() -
              (b?.arrivalDate as Date).getTime()
          )
          .map((fleetData) => {
            if (!fleetData?.arrivalDate) return null;
            return (
              <FleetArrivalRow
                key={fleetData?.arrivalDate?.getTime()}
                fleetData={fleetData}
                arrivalDate={fleetData.arrivalDate}
                players={players}
              />
            );
          })}
      </Box>
    </Box>
  );
}
