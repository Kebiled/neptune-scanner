import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";

export default async function Home() {
  // const res = await fetch(
  //   `https://np.ironhelmet.com/api?game_number=6420290023981056&code=gazRh6&api_version=0.1`,
  //   {
  //     method: "POST",
  //   }
  // );
  // const result = await res.json();
  // console.log(result);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <Box className="w-[800px] min-h-[400px] bg-slate-200 rounded-md">
        <Text className="text-black">HOME</Text>
      </Box>
    </main>
  );
}
