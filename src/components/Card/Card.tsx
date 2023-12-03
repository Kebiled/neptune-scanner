import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import { ReactNode } from "react";

export enum CardSizeEnum {
  SMALL = "SMALL",
  LARGE = "LARGE",
}

type CardProps = {
  title: string;
  cardSize: CardSizeEnum;
  children: ReactNode;
};

export default function Card({ title, cardSize, children }: CardProps) {
  return (
    <Box
      className={`${
        cardSize === "SMALL" ? "w-cardSmall" : "w-cardLarge"
      } min-h-[250px] bg-slate-200 rounded-md px-3 pt-3`}
    >
      <Text className="text-black font-bold text-lg">{title}</Text>
      {children}
    </Box>
  );
}
