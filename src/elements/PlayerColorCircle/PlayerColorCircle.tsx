import { PLAYER_COLORS } from "@/utils/colors";
import Box from "../Box/Box";

export function PlayerColorCircle({ playerId }: { playerId: number }) {
  if (playerId === -1) return null;
  return (
    <Box
      className={`my-auto mr-2 rounded-full w-4 h-4 bg-${PLAYER_COLORS[playerId]}`}
    />
  );
}
