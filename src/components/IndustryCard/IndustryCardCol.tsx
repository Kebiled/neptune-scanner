import { Player } from "@/utils/types";
import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PlayerColorCircle } from "@/elements/PlayerColorCircle/PlayerColorCircle";

type IndustryCardColProps = {
  player?: Player;
  title?: boolean;
};

export default function IndustryCardCol({
  player,
  title,
}: IndustryCardColProps) {
  const textClassName = `text-black${title ? " font-bold" : ""}`;
  if (title) {
    return (
      <Box className="flex justify-between">
        <Box className="flex w-1/4">
          <>
            <PlayerColorCircle playerId={-1} />
            <Text className="text-black font-bold">Player:</Text>
          </>
        </Box>
        <Box className="flex w-1/5 ml-6">
          <Text className={textClassName}>Industry:</Text>
        </Box>
        <Box className="flex w-1/5">
          <Text className={textClassName}>Total Ships:</Text>
        </Box>
        <Box className="flex w-1/5">
          <Text className={textClassName}>Ships per day:</Text>
        </Box>
      </Box>
    );
  }
  if (!player?.totalIndustry || !player.tech?.manufacturing.level) return null;
  return (
    <Box className="flex justify-between">
      <Box className="flex w-1/4">
        <>
          <PlayerColorCircle playerId={player.playerId} />
          <Text className="text-black">{player.alias}</Text>
        </>
      </Box>
      <Box className="flex w-1/5 ml-6">
        <Text className={textClassName}>{String(player.totalIndustry)}</Text>
      </Box>
      <Box className="flex w-1/5">
        <Text className={textClassName}>{String(player.totalStrength)}</Text>
      </Box>
      <Box className="flex w-1/5">
        <Text className={textClassName}>
          {String(player.totalIndustry * player.tech?.manufacturing.level)}
        </Text>
      </Box>
    </Box>
  );
}
