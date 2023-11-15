"use client";

import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PLAYER_COLORS } from "@/utils/colors";
import { Player } from "@/utils/types";
import React, { useState, useEffect } from "react";

type FleetArrivalRowProps = {
  fleetData: {
    starName: string | null | undefined;
    ownedBy: number | null | undefined;
    arrivalDate: Date | null | undefined;
  } | null;
  arrivalDate: Date;
  players: Player[];
};

function getPlayerAliasById(players: Player[], id: number) {
  if (id === -1) return "Empty";
  const player = players.filter((player) => player.uid === id)[0];
  return player.alias;
}

export default function FleetArrivalRow({
  fleetData,
  arrivalDate,
  players,
}: FleetArrivalRowProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

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

  return (
    <Box className="flex flex-row justify-between">
      <Box className="w-1/4">
        <Text className="text-black">{fleetData?.starName}</Text>
      </Box>
      {fleetData?.ownedBy ? (
        <Box className="flex w-1/4">
          <Box
            className={`my-auto mr-2 rounded-full w-4 h-4 bg-${
              PLAYER_COLORS[fleetData?.ownedBy]
            }`}
          />

          <Text className="text-black">
            {fleetData?.ownedBy
              ? getPlayerAliasById(players, fleetData?.ownedBy)
              : "None"}
          </Text>
        </Box>
      ) : null}
      <Box className="w-1/4">
        <Text className="text-black">{timeLeft}</Text>
      </Box>
    </Box>
  );
}
