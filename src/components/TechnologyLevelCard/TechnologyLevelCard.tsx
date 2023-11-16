import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { Player } from "@/utils/types";
import TechnologyLevelCol from "./TechnologyLevelCol";

type TechnologyLevelCardProps = {
  players: Player[];
};

export default function TechnologyLevelCard({
  players,
}: TechnologyLevelCardProps) {
  return (
    <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
      <Text className="text-black font-bold text-lg">Technology Level</Text>
      <Box className="flex flex-row w-full justify-between mt-10 mb-5">
        <Box className="mr-20">
          <TechnologyLevelCol key={"title"} />
        </Box>
        {players.map((player) => {
          if (!player) return null;
          return <TechnologyLevelCol key={player.playerId} player={player} />;
        })}
      </Box>
    </Box>
  );
}