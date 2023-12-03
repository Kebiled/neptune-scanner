import prisma from "../../lib/prisma";
import { processDBOrder } from "./fleetOrders";
import { Game, Player, Star, TechLevels } from "./types";

// TODO: Type Game Object and process data before storing in DB
// TODO: Rewrite DB types and model

// TODO: Type all objects and add to type file in ./utils
// TODO: Cache the get functions here

// Function to push the new object to the database
export async function pushObjectToDatabase(
  gameObject: any,
  gameNumber: string
) {
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

  console.log(gameObject.scanning_data.stars);

  const currentGameState = (await prisma.game.findUnique({
    where: {
      gameNumber,
    },
  })) as Game;

  // fetch stars from db as they are relational
  // const isDarkGalaxy =
  //   currentGameState.totalStars === currentGameState.stars.length;

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

  // if (!currentGameState) {
  //   // create objects
  // } else if (isDarkGalaxy) {
  //   // upsertVisibleStars
  //   // upsertFleets
  //   // update objects
  // } else {
  //   // upsertFleets
  //   // update objects
  // }

  await createOrUpdateFleetRecords(game, fleets);
  await createOrUpdateStarRecords(game, stars);
  await createOrUpdatePlayerRecords(game, players);

  await prisma.$disconnect();
}

async function createOrUpdateFleetRecords(game: any, fleets: any) {
  const upserts = [];
  for (const fleetId in fleets) {
    const fleetData = fleets[fleetId];
    upserts.push(upsertFleet(game, fleetData, fleetId));
  }
  await prisma.$transaction(upserts);
}

function upsertFleet(game: any, fleetData: any, fleetId: string) {
  return prisma.fleet.upsert({
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

// TODO: check if game has started in last snapshot, if so, only update stars
async function createOrUpdateStarRecords(game: any, stars: any) {
  const upserts = [];
  for (const starId in stars) {
    const starData = stars[starId];
    if (starData.v) {
      upserts.push(upsertVisibleStar(game, starData, starId));
    } else {
      upserts.push(upsertHiddenStar(game, starData, starId));
    }
  }
  await prisma.$transaction(upserts);
}

function upsertVisibleStar(game: any, starData: any, starId: string) {
  return prisma.star.upsert({
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

function upsertHiddenStar(game: any, starData: any, starId: string) {
  return prisma.star.upsert({
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
      n: starData.n,
      puid: starData.puid,
      v: starData.v,
    },
  });
}

async function createOrUpdatePlayerRecords(game: any, players: any) {
  const upserts = [];
  for (const playerId in players) {
    const playerData = players[playerId];
    upserts.push(upsertPlayer(game, playerData, playerId));
  }
  await prisma.$transaction(upserts);
}

function upsertPlayer(game: any, playerData: any, playerId: string) {
  return prisma.player.upsert({
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

  const parsedPlayers = players.map((player) => {
    const tech = player.tech ? JSON.stringify(player.tech) : null;
    if (tech) {
      const parsedTech: TechLevels = JSON.parse(tech);
      return { ...player, tech: { ...parsedTech } };
    }
    return player;
  });

  await prisma.$disconnect();
  return { ...gameState, players };
}

export async function getStar(starId: number) {
  const gameNumber = process.env.GAME_NUMBER;
  const star = (await prisma.star.findUnique({
    where: {
      gameId: gameNumber,
      starId,
    },
  })) as Star;

  await prisma.$disconnect();
  return star;
}

export async function getSnapshot(tick: number) {
  const gameNumber = process.env.GAME_NUMBER;
  const gameSnapshot = await prisma.gameSnapshot.findUnique({
    where: {
      gameNumberTick: `${gameNumber}+${tick}`,
    },
  });
  if (!gameSnapshot) return null;
  const players = gameSnapshot?.players
    ? JSON.stringify(gameSnapshot.players)
    : null;
  if (players) {
    const parsedPlayers = JSON.parse(players);
    return { ...gameSnapshot, players: { ...parsedPlayers } };
  }

  await prisma.$disconnect();
  return gameSnapshot;
}

export async function getPlayerFleets(playerId: number, gameNumber: string) {
  const fleets = await prisma.fleet.findMany({
    where: {
      gameId: gameNumber,
      puid: playerId,
    },
  });

  const processedFleets = fleets.map((fleet) => {
    const orders = fleet.o;
    if (!orders || orders.length === 0) {
      return { ...fleet, o: null };
    }
    const processedOrders = orders.map((order) => {
      if (order === null || typeof order !== "object") {
        return [];
      }
      if (Object.prototype.toString.call(order) === "[object Array]") {
        return processDBOrder(order);
      }
    });
    return {
      ...fleet,
      o: processedOrders.filter(
        (order) => order !== undefined && order !== null
      ),
    };
  });

  await prisma.$disconnect();
  return processedFleets;
}

// Cached fetches from DB
