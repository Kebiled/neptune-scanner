import { Fleet, Game, Player, Star } from "./types";

// TODO: Type Game Object
const { PrismaClient } = require("@prisma/client");

// TODO: Type all objects and add to type file in ./utils

// Function to push the new object to the database
export async function pushObjectToDatabase(
  gameObject: any,
  gameNumber: string
) {
  // Initialize Prisma client
  const prisma = new PrismaClient();

  // Extract relevant data from the new object
  const {
    name,
    paused,
    productions,
    tick_fragment,
    now,
    tick_rate,
    productionRate,
    stars_for_victory,
    game_over,
    started,
    start_time,
    total_stars,
    production_counter,
    trade_scanned,
    tick,
    trade_cost,
    admin,
    player_uid,
    turn_based,
    war,
    turn_based_time_out,
    fleets,
    stars,
    players,
  } = gameObject.scanning_data;

  console.log("START - Fetching current Game", Date.now());
  const currentGameState = (await prisma.game.findUnique({
    where: {
      gameNumber,
    },
  })) as Game;
  console.log("END - Fetching current Game", Date.now());

  // if (currentGameState.tick === gameObject.scanning_data.tick) {
  //   await prisma.$disconnect();
  //   throw new Error("API data already in DB - Same tick value");
  // }

  console.log("START - upsert new game data", Date.now());
  // Create or update the game record
  const game = await prisma.game.upsert({
    where: { name, gameNumber }, // Assuming 'name' is a unique identifier for the game
    create: {
      name,
      gameNumber,
      paused,
      productions,
      tickFragment: tick_fragment,
      now,
      tickRate: tick_rate,
      productionRate,
      starsForVictory: stars_for_victory,
      gameOver: game_over,
      started,
      startTime: start_time,
      totalStars: total_stars,
      productionCounter: production_counter,
      tradeScanned: trade_scanned,
      tick,
      tradeCost: trade_cost,
      admin,
      playerUid: player_uid,
      turnBased: turn_based,
      war,
      turnBasedTimeOut: turn_based_time_out,
    },
    update: {
      paused,
      productions,
      tickFragment: tick_fragment,
      now,
      tickRate: tick_rate,
      productionRate,
      starsForVictory: stars_for_victory,
      gameOver: game_over,
      started,
      startTime: start_time,
      totalStars: total_stars,
      productionCounter: production_counter,
      tradeScanned: trade_scanned,
      tick,
      tradeCost: trade_cost,
      admin,
      playerUid: player_uid,
      turnBased: turn_based,
      war,
      turnBasedTimeOut: turn_based_time_out,
    },
  });
  console.log("END - upsert new game data", Date.now());

  console.log("START - check existing snapshot", Date.now());
  // Check for existing snapshot on this tick
  const snapshot = await prisma.gameSnapshot.findMany({
    where: {
      gameNumberTick: `${gameNumber}+${tick}`,
    },
  });
  console.log("END - check existing snapshot", Date.now());

  console.log("START - create new snapshot", Date.now());
  // Create a new GameSnapshot record if none found
  if (snapshot.length === 0) {
    await prisma.gameSnapshot.create({
      data: {
        gameNumberTick: `${gameNumber}+${tick}`,
        gameNumber,
        tick,
        name,
        paused,
        productions,
        tickFragment: tick_fragment,
        now,
        tickRate: tick_rate,
        productionRate,
        starsForVictory: stars_for_victory,
        gameOver: game_over,
        started,
        startTime: start_time,
        totalStars: total_stars,
        productionCounter: production_counter,
        tradeScanned: trade_scanned,
        tradeCost: trade_cost,
        admin,
        playerUid: player_uid,
        turnBased: turn_based,
        war,
        turnBasedTimeOut: turn_based_time_out,
        fleets,
        stars,
        players,
      },
    });
  }
  console.log("END - create new snapshot", Date.now());

  console.log("START - upsert fleet", Date.now());
  await createOrUpdateFleetRecords(game, fleets, prisma);
  console.log("END - upsert fleet", Date.now());
  console.log("START - upsert stars", Date.now());
  await createOrUpdateStarRecords(game, stars, prisma);
  console.log("END - upsert stars", Date.now());
  console.log("START - upsert players", Date.now());
  await createOrUpdatePlayerRecords(game, players, prisma);
  console.log("END - upsert players", Date.now());

  await prisma.$disconnect();
}

async function createOrUpdateFleetRecords(
  game: any,
  fleets: any,
  prisma: typeof PrismaClient
) {
  const upserts = [];
  for (const fleetId in fleets) {
    const fleetData = fleets[fleetId];
    upserts.push(upsertFleet(game, fleetData, fleetId, prisma));
  }
  await Promise.all(upserts);
}

async function upsertFleet(
  game: any,
  fleetData: any,
  fleetId: string,
  prisma: typeof PrismaClient
) {
  await prisma.fleet.upsert({
    where: {
      gameId: game.gameNumber,
      fleetId: parseInt(fleetId),
    },
    create: {
      gameId: game.gameNumber,
      fleetId: parseInt(fleetId),
      exp: fleetData.exp,
      l: fleetData.l,
      lx: fleetData.lx,
      ly: fleetData.ly,
      n: fleetData.n,
      o: fleetData.o,
      ouid: fleetData.ouid,
      puid: fleetData.puid,
      sp: fleetData.sp,
      st: fleetData.st,
      uid: fleetData.uid,
      w: fleetData.w,
      x: fleetData.x,
      y: fleetData.y,
    },
    update: {
      exp: fleetData.exp,
      l: fleetData.l,
      lx: fleetData.lx,
      ly: fleetData.ly,
      n: fleetData.n,
      o: fleetData.o,
      ouid: fleetData.ouid,
      puid: fleetData.puid,
      sp: fleetData.sp,
      st: fleetData.st,
      w: fleetData.w,
      x: fleetData.x,
      y: fleetData.y,
    },
  });
}

async function createOrUpdateStarRecords(
  game: any,
  stars: any,
  prisma: typeof PrismaClient
) {
  const upserts = [];
  for (const starId in stars) {
    const starData = stars[starId];
    if (starData.visible) {
      upserts.push(upsertVisibleStar(game, starData, starId, prisma));
    } else {
      upserts.push(upsertHiddenStar(game, starData, starId, prisma));
    }
  }
  await Promise.all(upserts);
}

async function upsertVisibleStar(
  game: any,
  starData: any,
  starId: string,
  prisma: typeof PrismaClient
) {
  prisma.star.upsert({
    where: {
      gameId: game.gameNumber,
      starId: parseInt(starId),
    },
    create: {
      gameId: game.gameNumber,
      starId: parseInt(starId),
      c: starData.c,
      e: starData.e,
      exp: starData.exp,
      ga: starData.ga,
      i: starData.i,
      n: starData.n,
      nr: starData.nr,
      puid: starData.puid,
      r: starData.r,
      s: starData.s,
      st: starData.st,
      uid: starData.uid,
      v: starData.v,
      x: starData.x,
      y: starData.y,
    },
    update: {
      c: starData.c,
      exp: starData.exp,
      ga: starData.ga,
      i: starData.i,
      puid: starData.puid,
      r: starData.r,
      s: starData.s,
      st: starData.st,
      v: starData.v,
    },
  });
}

async function upsertHiddenStar(
  game: any,
  starData: any,
  starId: string,
  prisma: typeof PrismaClient
) {
  prisma.star.upsert({
    where: {
      gameId: game.gameNumber,
      starId: parseInt(starId),
    },
    create: {
      gameId: game.gameNumber,
      starId: parseInt(starId),
      c: starData.c,
      n: starData.n,
      puid: starData.puid,
      uid: starData.uid,
      v: starData.v,
      x: starData.x,
      y: starData.y,
    },
    update: {
      c: starData.c,
      n: starData.n,
      puid: starData.puid,
      v: starData.v,
    },
  });
}

async function createOrUpdatePlayerRecords(
  game: any,
  players: any,
  prisma: typeof PrismaClient
) {
  const upserts = [];
  for (const playerId in players) {
    const playerData = players[playerId];
    upserts.push(upsertPlayer(game, playerData, playerId, prisma));
  }
  await Promise.all(upserts);
}

async function upsertPlayer(
  game: any,
  playerData: any,
  playerId: string,
  prisma: typeof PrismaClient
) {
  prisma.player.upsert({
    where: {
      gameId: game.gameNumber,
      playerId: parseInt(playerId),
    },
    create: {
      gameId: game.gameNumber,
      playerId: parseInt(playerId),
      ai: playerData.ai,
      alias: playerData.alias,
      avatar: playerData.avatar,
      cash: playerData.cash,
      color: playerData.color,
      conceded: playerData.conceded,
      countdownToWar: playerData.countdown_to_war,
      fleetPrice: playerData.fleet_price,
      huid: playerData.huid,
      karmaToGive: playerData.karma_to_give,
      ledger: playerData.ledger,
      missedTurns: playerData.missed_turns,
      race: playerData.race,
      ready: playerData.ready,
      regard: playerData.regard,
      researching: playerData.researching,
      researchingNext: playerData.researching_next,
      starsAbandoned: playerData.stars_abandoned,
      ses: playerData.ses,
      shape: playerData.shape,
      tech: playerData.tech,
      totalEconomy: playerData.total_economy,
      totalFleets: playerData.total_fleets,
      totalIndustry: playerData.total_industry,
      totalScience: playerData.total_science,
      totalStars: playerData.total_stars,
      totalStrength: playerData.total_strength,
      uid: playerData.uid,
      war: playerData.war,
    },
    update: {
      ai: playerData.ai,
      cash: playerData.cash,
      conceded: playerData.conceded,
      countdownToWar: playerData.countdown_to_war,
      fleetPrice: playerData.fleet_price,
      karmaToGive: playerData.karma_to_give,
      ledger: playerData.ledger,
      missedTurns: playerData.missed_turns,
      race: playerData.race,
      ready: playerData.ready,
      regard: playerData.regard,
      researching: playerData.researching,
      researchingNext: playerData.researching_next,
      starsAbandoned: playerData.stars_abandoned,
      ses: playerData.ses,
      shape: playerData.shape,
      tech: playerData.tech,
      totalEconomy: playerData.total_economy,
      totalFleets: playerData.total_fleets,
      totalIndustry: playerData.total_industry,
      totalScience: playerData.total_science,
      totalStars: playerData.total_stars,
      totalStrength: playerData.total_strength,
      war: playerData.war,
    },
  });
}

export async function getCurrentGameState(gameNumber: string) {
  const prisma = new PrismaClient();
  const gameState = (await prisma.game.findUnique({
    where: {
      gameNumber,
    },
  })) as Game;

  const players = (await prisma.player.findMany({
    where: {
      gameId: gameNumber,
    },
  })) as Player[];

  const fleets = (await prisma.fleet.findMany({
    where: {
      gameId: gameNumber,
    },
  })) as Fleet[];

  // const stars = (await prisma.star.findMany({
  //   where: {
  //     gameId: gameNumber,
  //   },
  // })) as Star[];

  await prisma.$disconnect();
  return { ...gameState, players, fleets };
}

export async function getStar(starId: string, gameNumber: string) {
  const prisma = new PrismaClient();

  const star = (await prisma.star.findUnique({
    where: {
      gameId: gameNumber,
      starId,
    },
  })) as Star[];

  await prisma.$disconnect();
  return star;
}
