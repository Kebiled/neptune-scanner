"use client";

import Box from "@/elements/Box/Box";
import { PlayerColorCircle } from "@/elements/PlayerColorCircle/PlayerColorCircle";
import Text from "@/elements/Text/Text";
import { getApiKey, getGameNumber, usePlayers } from "@/utils/dataHooks";
import { FleetArrivalData, Player } from "@/utils/types";
import React, { useState, useEffect } from "react";

type FleetArrivalRowProps = {
  fleetData: FleetArrivalData;
  arrivalDate: Date;
};

function getPlayerAliasById(players: Player[], id: number) {
  if (id === -1) return "Empty";
  const player = players.filter((player) => player.uid === id)[0];
  return player.alias;
}

export default function FleetArrivalRow({
  fleetData,
  arrivalDate,
}: FleetArrivalRowProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const apiKey = getApiKey();
  const gameNumber = getGameNumber();
  const { players, isLoading, isError } = usePlayers(gameNumber, apiKey);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = arrivalDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("Arrived!");
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [arrivalDate]);

  if (isLoading) {
    return null;
  }

  return (
    <Box className="flex flex-row justify-between">
      <Box className="w-1/5">
        <Text className="text-black">{fleetData?.starName}</Text>
      </Box>
      {fleetData?.ownedBy || fleetData?.ownedBy === 0 ? (
        <Box className="flex w-1/5">
          <PlayerColorCircle playerId={fleetData.ownedBy} />
          <Text className="text-black">
            {fleetData.ownedBy || fleetData?.ownedBy === 0
              ? getPlayerAliasById(players, fleetData.ownedBy)
              : "None"}
          </Text>
        </Box>
      ) : null}
      <Box className="w-1/6">
        <Text className="text-black">{`${
          fleetData?.fleetStrength === null
            ? "Hidden"
            : fleetData?.fleetStrength
        }`}</Text>
      </Box>
      <Box className="w-1/6">
        <Text className="text-black">{`${
          fleetData?.starStrength === null ? "Hidden" : fleetData?.starStrength
        }`}</Text>
      </Box>
      <Box className="w-1/5">
        <Text className="text-black">{timeLeft}</Text>
      </Box>
    </Box>
  );
}
