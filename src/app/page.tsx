import Box from "@/elements/Box/Box";
import Text from "@/elements/Text/Text";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <Box className="w-[800px] min-h-[400px] bg-slate-200 rounded-md">
        <Text className="text-black">HOME BASE</Text>
      </Box>
    </main>
  );
}
