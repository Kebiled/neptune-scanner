import Box from "@/elements/Box/Box";
import CycleGainCol from "./CycleGainCol";
import Card, { CardSizeEnum } from "../Card/Card";
import CycleGainContent from "./CycleGainContent";

export default function CycleGainCard() {
  return (
    <Card cardSize={CardSizeEnum.LARGE} title={"Changes Over Last Cycle"}>
      <Box className="flex flex-row w-full h-full justify-between mt-10 mb-5">
        <Box className="mr-20">
          <CycleGainCol key={"title"} />
        </Box>
        <CycleGainContent />
      </Box>
    </Card>
  );
}
