// "use client";

// import React, { PureComponent, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import Box from "@/elements/Box/Box";
// import Button from "@/elements/Button/Button";
// import { getApiKey, getGameNumber, useDataSets } from "@/utils/dataHooks";
// import { PLAYER_COLORS_HEX } from "@/utils/colors";
// import { DatasetsType, SnapshotDatasetType } from "@/utils/datasets";

// enum ChartData {
//   INDUSTRY = "Industry",
//   ECONOMY = "Economy",
//   SCIENCE = "Science",
//   SHIPS = "Ships",
//   STARS = "Stars",
// }

// function getChartData({
//   datasets,
//   currentChartData,
//   setData,
// }: {
//   datasets: DatasetsType;
//   currentChartData: ChartData;
//   setData: React.Dispatch<React.SetStateAction<SnapshotDatasetType[]>>;
// }) {
//   switch (currentChartData) {
//     case "Industry":
//       setData(datasets.industry.data);
//     case "Economy":
//       setData(datasets.economy.data);
//     case "Science":
//       setData(datasets.science.data);
//     case "Ships":
//       setData(datasets.ships.data);
//     case "Stars":
//       setData(datasets.stars.data);
//     default:
//       setData(datasets.industry.data);
//   }
// }

// export default function IndustryChartCard() {
//   const [currentChartData, setCurrentChartData] = useState<ChartData>(
//     ChartData.INDUSTRY
//   );
//   const [data, setData] = useState<SnapshotDatasetType[]>([]);
//   const [startTick, setStartTick] = useState<number>(0);
//   // TODO: fetch current game state to get current tick
//   const [endTick, setEndTick] = useState<number>(360);
//   // TODO: attempt to make interval a factor of end tick
//   const [tickInterval, setTickInterval] = useState<number>(10);

//   const apiKey = getApiKey();
//   const gameNumber = getGameNumber();
//   // TODO: use state for numbers below
//   const { datasets, isLoading, isError } = useDataSets(
//     gameNumber,
//     apiKey,
//     startTick,
//     endTick,
//     tickInterval
//   );

//   if (isLoading || !datasets) {
//     return (
//       <Box className="w-full h-[200px] bg-slate-300 rounded-md flex flex-col mt-10 mb-5 animate-pulse" />
//     );
//   }

//   // TODO: add route state to change data
//   // disable buttons on isLoading
//   // break apart component into two sections, with controls outside of swr component

//   return (
//     <Box className="flex flex-col gap-2 rounded-md bg-slate-400">
//       <Box className="w-[800px] h-[100px] bg-slate-200 rounded-t-md">
//         <Box className="flex flex-row justify-between px-3 py-6">
//           <Button
//             className="border border-slate-600 px-3 py-1 rounded-full"
//             textClassName="text-black"
//             onClick={() => {
//               setCurrentChartData(ChartData.INDUSTRY);
//             }}
//           >
//             Industry
//           </Button>
//           <Button
//             className="border border-slate-600 px-3 py-1 rounded-full"
//             textClassName="text-black"
//             onClick={() => {
//               setCurrentChartData(ChartData.ECONOMY);
//             }}
//           >
//             Economy
//           </Button>
//           <Button
//             className="border border-slate-600 px-3 py-1 rounded-full"
//             textClassName="text-black"
//             onClick={() => {
//               setCurrentChartData(ChartData.SCIENCE);
//             }}
//           >
//             Science
//           </Button>
//           <Button
//             className="border border-slate-600 px-3 py-1 rounded-full"
//             textClassName="text-black"
//             onClick={() => {
//               setCurrentChartData(ChartData.STARS);
//             }}
//           >
//             Stars
//           </Button>
//           <Button
//             className="border border-slate-600 px-3 py-1 rounded-full"
//             textClassName="text-black"
//             onClick={() => {
//               setCurrentChartData(ChartData.SHIPS);
//             }}
//           >
//             Ships
//           </Button>
//         </Box>
//       </Box>
//       <Box className="w-[800px] h-[400px] bg-slate-200 rounded-b-md py-5 pr-5">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             width={500}
//             height={300}
//             data={data}
//             margin={{
//               top: 5,
//               right: 30,
//               left: 10,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             {/* TODO: generate with players list */}
//             <Line type="monotone" dataKey={0} stroke={PLAYER_COLORS_HEX[0]} />
//             <Line type="monotone" dataKey={1} stroke={PLAYER_COLORS_HEX[1]} />
//             <Line type="monotone" dataKey={2} stroke={PLAYER_COLORS_HEX[2]} />
//             <Line type="monotone" dataKey={3} stroke={PLAYER_COLORS_HEX[3]} />
//             <Line type="monotone" dataKey={4} stroke={PLAYER_COLORS_HEX[4]} />
//             <Line type="monotone" dataKey={5} stroke={PLAYER_COLORS_HEX[5]} />
//             <Line type="monotone" dataKey={6} stroke={PLAYER_COLORS_HEX[6]} />
//           </LineChart>
//         </ResponsiveContainer>
//       </Box>
//     </Box>
//   );
// }
