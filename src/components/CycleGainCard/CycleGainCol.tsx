import Box from "@/elements/Box/Box";
import { PlayerColorCircle } from "@/elements/PlayerColorCircle/PlayerColorCircle";
import Text from "@/elements/Text/Text";
import { PLAYER_COLORS } from "@/utils/colors";

type CycleGainColProps = {
  playerComparison?: {
    alias: string;
    playerId: number;
    starGain: number;
    shipsGain: number;
    economyGain: number;
    industryGain: number;
    scienceGain: number;
  };
};

export default function CycleGainCol({ playerComparison }: CycleGainColProps) {
  const textClassName = `text-${
    !playerComparison ? "black text-bold" : "slate-800"
  }`;
  return (
    <Box className="flex flex-col justify-between">
      {!playerComparison ? (
        <Text className="text-black">Player Color</Text>
      ) : (
        <PlayerColorCircle playerId={playerComparison.playerId} />
      )}
      <Text className={textClassName}>
        {!playerComparison ? "Stars" : `${playerComparison.starGain}`}
      </Text>
      <Text className={textClassName}>
        {!playerComparison ? "Ships" : `${playerComparison.shipsGain}`}
      </Text>
      <Text className={textClassName}>
        {!playerComparison ? "Economy" : `${playerComparison.economyGain}`}
      </Text>
      <Text className={textClassName}>
        {!playerComparison ? "Industry" : `${playerComparison.industryGain}`}
      </Text>
      <Text className={textClassName}>
        {!playerComparison ? "Science" : `${playerComparison.scienceGain}`}
      </Text>
    </Box>
  );
}
