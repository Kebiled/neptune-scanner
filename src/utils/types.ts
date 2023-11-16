export type Game = {
  gameNumber: string;
  name: string;
  paused?: boolean | null;
  productions?: number | null;
  tickFragment?: number | null;
  now?: bigint | null;
  tickRate?: number | null;
  productionRate?: number | null;
  starsForVictory?: number | null;
  gameOver?: number | null;
  started?: boolean | null;
  startTime?: bigint | null;
  totalStars?: number | null;
  productionCounter?: number | null;
  tradeScanned?: number | null;
  tick?: number | null;
  tradeCost?: number | null;
  admin?: number | null;
  playerUid?: number | null;
  turnBased?: number | null;
  war?: number | null;
  turnBasedTimeOut?: number | null;
  fleets: Fleet[];
  stars: Star[];
  players: Player[];
  GameSnapshot: GameSnapshot[];
};

export type GameSnapshot = {
  gameNumberTick: string;
  gameNumber: string;
  name: string;
  tick: number;
  createdAt: Date;
  game: Game;
  paused?: boolean | null;
  productions?: number | null;
  tickFragment?: number | null;
  now?: bigint | null;
  tickRate?: number | null;
  productionRate?: number | null;
  starsForVictory?: number | null;
  gameOver?: number | null;
  started?: boolean | null;
  startTime?: bigint | null;
  totalStars?: number | null;
  productionCounter?: number | null;
  tradeScanned?: number | null;
  tradeCost?: number | null;
  admin?: number | null;
  playerUid?: number | null;
  turnBased?: number | null;
  war?: number | null;
  turnBasedTimeOut?: number | null;
  fleets: Record<string, unknown>;
  stars: Record<string, unknown>;
  players: Record<string, unknown>;
};

export type Player = {
  gameId: string;
  playerId: number;
  ai?: number | null;
  alias?: string | null;
  avatar?: number | null;
  cash?: number | null;
  color?: number | null;
  conceded?: number | null;
  countdownToWar?: Record<string, number> | null | undefined;
  fleetPrice?: number | null;
  huid?: number | null;
  karmaToGive?: number | null;
  ledger?: Record<string, number> | null;
  missedTurns?: number | null;
  race?: [number | null, number | null] | null;
  ready?: number | null;
  regard?: number | null;
  researching?: string | null;
  researchingNext?: string | null;
  starsAbandoned?: number | null;
  ses?: number | null;
  shape?: number | null;
  tech?: TechLevels | null;
  totalEconomy?: number | null;
  totalFleets?: number | null;
  totalIndustry?: number | null;
  totalScience?: number | null;
  totalStars?: number | null;
  totalStrength?: number | null;
  uid?: number | null;
  war?: Record<string, unknown> | null;
};

export type Star = {
  gameId: string;
  starId: number;
  c?: number | null;
  e?: number | null;
  exp?: number | null;
  ga?: number | null;
  i?: number | null;
  n?: string | null;
  nr?: number | null;
  puid?: number | null;
  r?: number | null;
  s?: number | null;
  st?: number | null;
  uid?: number | null;
  v?: string | null;
  x?: string | null;
  y?: string | null;
};

export type Fleet = {
  gameId: string;
  fleetId: number;
  exp?: number | null;
  l?: number | null;
  lx?: string | null;
  ly?: string | null;
  n?: string | null;
  o?: FleetOrder[] | null;
  ouid?: number | null;
  puid?: number | null;
  sp?: number | null;
  st?: number | null;
  uid?: number | null;
  w?: number | null;
  x?: string | null;
  y?: string | null;
};

export type TechLevels = {
  banking: { level: number; value: number };
  weapons: { level: number; value: number };
  research: { level: number; value: number };
  scanning: { level: number; value: number };
  propulsion: { level: number; value: number };
  terraforming: { level: number; value: number };
  manufacturing: { level: number; value: number };
};

export type DBFleetOrder = object | [];

export type FleetOrder = {
  delayInTicks: number;
  starId: number;
  orderType: keyof OrderType;
  numberOfShips: number;
};

export enum OrderType {
  DoNothing = 0,
  CollectAll = 1,
  DropAll = 2,
  Collect = 3,
  Drop = 4,
  CollectAllBut = 5,
  DropAllBut = 6,
  GarrisonStar = 7,
}

export enum BUILDING_TYPE {
  ECONOMY = "Economy",
  INDUSTRY = "Industry",
  SCIENCE = "Science",
}

export type Coord = {
  x: number;
  y: number;
};
