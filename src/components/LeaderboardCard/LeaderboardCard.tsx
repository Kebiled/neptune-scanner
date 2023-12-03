import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { getNextCycleDate } from "@/utils/time";
import { Game } from "@/utils/types";
import LeaderboardProductionCycle from "./LeaderboardProductionCycle";
import LeaderboardContent from "./LeaderboardContent";

type LeaderboardCardProps = {
  gameName: string;
  gameState: Game;
  gameTick: number;
};

export default function LeaderboardCard({
  gameName,
  gameState,
  gameTick,
}: LeaderboardCardProps) {
  const cycleDate = getNextCycleDate(gameState);

  return (
    <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
      <Box className="flex justify-between">
        <Box className="w-1/4">
          <Text className="text-black font-bold text-lg">{gameName}</Text>
        </Box>
        {!!cycleDate ? (
          <LeaderboardProductionCycle cycleDate={cycleDate} />
        ) : null}
        <Box className="w-1/4">
          <Text className="text-black font-bold text-lg">
            Cycle: {`${Math.floor(gameTick / 24)}`} Tick: {`${gameTick}`}
          </Text>
        </Box>
      </Box>
      <LeaderboardContent />
    </Box>
  );
}
