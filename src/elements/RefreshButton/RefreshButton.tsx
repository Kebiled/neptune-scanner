"use client";
import Button from "@/elements/Button/Button";
import { revalidatePath } from "next/cache";

function refreshData() {
  revalidatePath("/", "layout");
}

export default function RefreshButton() {
  return (
    <Button
      className="h-10 w-20 bg-white rounded-full"
      textClassName="text-black"
      onPress={refreshData}
    >
      Refresh
    </Button>
  );
}
