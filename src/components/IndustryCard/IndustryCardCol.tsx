import { Player } from "@/utils/types";
import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PlayerColorCircle } from "@/elements/PlayerColorCircle/PlayerColorCircle";

type IndustryCardColProps = {
  player: Player;
  title?: boolean;
};

export default function IndustryCardCol({
  player,
  title,
}: IndustryCardColProps) {
  if (!player.totalIndustry || !player.tech?.manufacturing.level) return null;
  const textClassName = `text-black${title ? " font-bold" : ""}`;
  return (
    <Box className="flex justify-between">
      <Box className="flex w-1/4">
        {title ? (
          <>
            <PlayerColorCircle playerId={title ? -1 : player.playerId} />
            <Text className="text-black font-bold">Player:</Text>
          </>
        ) : (
          <>
            <PlayerColorCircle playerId={player.playerId} />
            <Text className="text-black">{player.alias}</Text>
          </>
        )}
      </Box>
      <Box className="flex w-1/5 ml-6">
        <Text className={textClassName}>
          {title ? "Industry:" : String(player.totalIndustry)}
        </Text>
      </Box>
      <Box className="flex w-1/5">
        <Text className={textClassName}>
          {title ? "Total Ships:" : String(player.totalStrength)}
        </Text>
      </Box>
      <Box className="flex w-1/5">
        <Text className={textClassName}>
          {title
            ? "Ships per day:"
            : String(player.totalIndustry * player.tech?.manufacturing.level)}
        </Text>
      </Box>
    </Box>
  );
}
