import React from "react";
import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { Player } from "@/utils/types";
import { PlayerColorCircle } from "@/elements/PlayerColorCircle/PlayerColorCircle";
import IndustryCardCol from "./IndustryCardCol";

type IndustryCardProps = {
  players: Player[];
};

export default function IndustryCard({ players }: IndustryCardProps) {
  return (
    <Box className="flex flex-col min-w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3 pb-6">
      <Text className="text-black font-bold text-lg mb-10">
        Industry & Ships
      </Text>
      <IndustryCardCol player={players[0]} title />
      {players.map((player, index) => (
        <IndustryCardCol key={index} player={player} />
      ))}
    </Box>
  );
}
