import { Game, Player } from "./types";

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

  console.log(gameObject);
  const currentGameState = (await prisma.game.findUnique({
    where: {
      gameNumber,
    },
  })) as Game;

  if (currentGameState.tick === gameObject.scanning_data.tick) {
    await prisma.$disconnect();
    throw new Error("API data already in DB - Same tick value");
  }

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

  // Check for existing snapshot on this tick
  const snapshot = await prisma.gameSnapshot.findMany({
    where: {
      gameNumberTick: `${gameNumber}+${tick}`,
    },
  });

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

  await createOrUpdateFleetRecords(game, fleets, prisma);
  await createOrUpdateStarRecords(game, stars, prisma);
  await createOrUpdatePlayerRecords(game, players, prisma);

  await prisma.$disconnect();
}

async function createOrUpdateFleetRecords(
  game: any,
  fleets: any,
  prisma: typeof PrismaClient
) {
  for (const fleetId in fleets) {
    const fleetData = fleets[fleetId];
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
        uid: fleetData.uid,
        w: fleetData.w,
        x: fleetData.x,
        y: fleetData.y,
      },
    });
  }
}

async function createOrUpdateStarRecords(
  game: any,
  stars: any,
  prisma: typeof PrismaClient
) {
  for (const starId in stars) {
    const starData = stars[starId];
    await prisma.star.upsert({
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
    });
  }
}

async function createOrUpdatePlayerRecords(
  game: any,
  players: any,
  prisma: typeof PrismaClient
) {
  for (const playerId in players) {
    const playerData = players[playerId];
    await prisma.player.upsert({
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
    });
  }
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

  await prisma.$disconnect();
  return { ...gameState, players };
}
