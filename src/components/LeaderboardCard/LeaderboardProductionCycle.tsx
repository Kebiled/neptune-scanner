"use client";

import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { useEffect, useState } from "react";

type LeaderboardProductionCycleProps = {
  cycleDate: Date;
};

export default function LeaderboardProductionCycle({
  cycleDate,
}: LeaderboardProductionCycleProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = cycleDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("Cycle Ending");
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cycleDate]);

  return (
    <Box className="w-1/2">
      <Text className="text-black font-bold text-lg">Production: </Text>
      <Text className="text-black font-bold text-lg">{timeLeft}</Text>
    </Box>
  );
}
