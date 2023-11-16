import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { PLAYER_COLORS } from "@/utils/colors";
import { Player } from "@/utils/types";

type TechnologyLevelColProps = {
  player?: Player;
};

export default function TechnologyLevelCol({
  player,
}: TechnologyLevelColProps) {
  const textClassName = `text-${
    !player ? "black text-bold" : "slate-800 ml-1"
  }`;
  return (
    <Box className="flex flex-col justify-between">
      {!player ? (
        <Text className="text-black">Player Color</Text>
      ) : (
        <Box
          className={`my-auto mr-2 rounded-full w-4 h-4 bg-${
            PLAYER_COLORS[player.playerId]
          }`}
        />
      )}
      <Text className={textClassName}>
        {!player ? "Weapons" : `${player.tech?.weapons.level}`}
      </Text>
      <Text className={textClassName}>
        {!player ? "Propulsion" : `${player.tech?.propulsion.level}`}
      </Text>
      <Text className={textClassName}>
        {!player ? "Banking" : `${player.tech?.banking.level}`}
      </Text>
      <Text className={textClassName}>
        {!player ? "Manufacturing" : `${player.tech?.manufacturing.level}`}
      </Text>
      <Text className={textClassName}>
        {!player ? "Research" : `${player.tech?.research.level}`}
      </Text>
      <Text className={textClassName}>
        {!player ? "Scanning" : `${player.tech?.scanning.level}`}
      </Text>
      <Text className={textClassName}>
        {!player ? "Terraforming" : `${player.tech?.terraforming.level}`}
      </Text>
    </Box>
  );
}
