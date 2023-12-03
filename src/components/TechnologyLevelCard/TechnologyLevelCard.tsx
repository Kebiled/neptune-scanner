import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import TechnologyLevelCol from "./TechnologyLevelCol";
import TechnologyLevelCardContent from "./TechnologyLevelCardContent";

export default function TechnologyLevelCard() {
  return (
    <Box className="w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3">
      <Text className="text-black font-bold text-lg">Technology Level</Text>
      <Box className="flex flex-row w-full justify-between mt-10 mb-5">
        <Box className="mr-20">
          <TechnologyLevelCol key={"title"} />
        </Box>
        <TechnologyLevelCardContent />
      </Box>
    </Box>
  );
}
