"use client";

import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import FleetArrivalCardContent from "./FleetArrivalCardContent";

// TODO: add amount of ships in fleet, amount of ships on target planet add battle calc
export default function FleetArrivalCard() {
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
        <FleetArrivalCardContent />
      </Box>
    </Box>
  );
}
