import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PLAYER_COLORS } from "@/utils/colors";
import { getNextCycleDate } from "@/utils/time";
import { Game, Player } from "@/utils/types";
import LeaderboardProductionCycle from "./LeaderboardProductionCycle";

type LeaderboardCardProps = {
  gameName: string;
  gameState: Game;
  gameTick: number;
  players: Player[];
};

export default function LeaderboardCard({
  gameName,
  gameState,
  gameTick,
  players,
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
      <Box className="flex flex-col mt-10 mb-5">
        {players
          .sort((a, b) => (b.totalStars || 0) - (a.totalStars || 0))
          .map((player, idx) => {
            return (
              <Box
                className={`flex flex-row justify-between bg-${
                  PLAYER_COLORS[player.playerId]
                } px-3`}
                key={player.playerId}
              >
                <Text className={`text-white`}>{player.alias}</Text>
                <Box className="flex">
                  <Text className="text-white ml-3">
                    Stars: {`${player.totalStars}`}
                  </Text>
                  <Text className="text-white ml-3">
                    Fleets: {`${player.totalFleets}`}
                  </Text>
                  <Text className="text-white ml-3">
                    Ships: {`${player.totalStrength}`}
                  </Text>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}
