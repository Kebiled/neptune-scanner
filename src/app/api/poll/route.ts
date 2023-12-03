import { pushObjectToDatabase } from "@/utils/prismaUtil";
import { revalidatePath } from "next/cache";

const GAME_NUMBER = "6420290023981056";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  try {
    // Fetch the game object from the API
    const response = await fetch(
      `https://np.ironhelmet.com/api?game_number=6420290023981056&code=gazRh6&api_version=0.1`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch game object");
    }

    const gameData = await response.json();
    revalidatePath("/");

    // // Push the game object data to the database using your function
    await pushObjectToDatabase(gameData, GAME_NUMBER);

    return new Response("Game object successfully pushed to the database", {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to poll and update the database:", error);

    return new Response("Failed to poll and update the database", {
      status: 500,
    });
  }
}
