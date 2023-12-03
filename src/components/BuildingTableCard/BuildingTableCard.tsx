import { BUILDING_TYPE, Player } from "@/utils/types";
import Card, { CardSizeEnum } from "../Card/Card";
import BuildingTableContent from "./BuildingTableContent";

interface BuildingTableCardProps {
  buildingType: BUILDING_TYPE;
}

export default function BuildingTableCard({
  buildingType,
}: BuildingTableCardProps) {
  return (
    <Card cardSize={CardSizeEnum.SMALL} title={buildingType}>
      <BuildingTableContent buildingType={buildingType} />
    </Card>
  );
}
