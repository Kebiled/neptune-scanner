import React from "react";
import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";
import IndustryCardCol from "./IndustryCardCol";
import IndustryCardContent from "./IndustryCardContent";

export default function IndustryCard() {
  return (
    <Box className="flex flex-col min-w-[800px] min-h-[200px] bg-slate-200 rounded-md px-3 pt-3 pb-6">
      <Text className="text-black font-bold text-lg mb-10">
        Industry & Ships
      </Text>
      <IndustryCardCol title />
      <IndustryCardContent />
    </Box>
  );
}
