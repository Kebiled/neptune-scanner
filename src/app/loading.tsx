import Box from "@/elements/Box/Box";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Box className="min-h-screen min-w-screen bg-slate-400">
      <Box className="max-w-[800px] max-h-[400px] bg-slate-200 animate-pulse" />
    </Box>
  );
}
