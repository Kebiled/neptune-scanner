import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import CycleGainCol from "./CycleGainCol";

type CycleGainCardProps = {
  cycleComparison: ({
    alias: string;
    playerId: number;
    starGain: number;
    shipsGain: number;
    economyGain: number;
    industryGain: number;
    scienceGain: number;
  } | null)[];
};

export default function CycleGainCard({ cycleComparison }: CycleGainCardProps) {
  return (
    <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
      <Text className="text-black font-bold text-lg">
        Gained Over Last Cycle
      </Text>
      <Box className="flex flex-row w-full justify-between mt-10">
        <Box className="mr-20">
          <CycleGainCol key={"title"} />
        </Box>
        {cycleComparison.map((playerComparison) => {
          if (!playerComparison) return null;
          return (
            <CycleGainCol
              key={playerComparison.playerId}
              playerComparison={playerComparison}
            />
          );
        })}
      </Box>
    </Box>
  );
}
