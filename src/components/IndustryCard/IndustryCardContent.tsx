"use client";

import React from "react";
import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import IndustryCardCol from "./IndustryCardCol";
import { getApiKey, getGameNumber, usePlayers } from "@/utils/dataHooks";

export default function IndustryCardContent() {
  const apiKey = getApiKey();
  const gameNumber = getGameNumber();
  const { players, isLoading, isError } = usePlayers(gameNumber, apiKey);

  if (isLoading || !players) {
    return (
      <Box className="flex w-full h-[150px] bg-slate-300 rounded-md px-3 pt-3 animate-pulse" />
    );
  }

  return (
    <>
      {players.map((player, index) => (
        <IndustryCardCol key={index} player={player} />
      ))}
    </>
  );
}
