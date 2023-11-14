// TODO: Type Game Object
const { PrismaClient } = require("@prisma/client");

// TODO: Type all objects and add to type file in ./utils

// Function to push the new object to the database
export async function pushObjectToDatabase(gameObject: any) {
  // Initialize Prisma client
  const prisma = new PrismaClient();

  try {
    // Extract relevant data from the new object
    const {
      name,
      paused,
      productions,
      tickFragment,
      now,
      tickRate,
      productionRate,
      starsForVictory,
      gameOver,
      started,
      startTime,
      totalStars,
      productionCounter,
      tradeScanned,
      tick,
      tradeCost,
      admin,
      playerUid,
      turnBased,
      war,
      turnBasedTimeOut,
      fleets,
      stars,
      players,
    } = gameObject;

    // Create or update the game record
    const game = await prisma.game.upsert({
      where: { name }, // Assuming 'name' is a unique identifier for the game
      create: {
        name,
        paused,
        productions,
        tickFragment,
        now,
        tickRate,
        productionRate,
        starsForVictory,
        gameOver,
        started,
        startTime,
        totalStars,
        productionCounter,
        tradeScanned,
        tick,
        tradeCost,
        admin,
        playerUid,
        turnBased,
        war,
        turnBasedTimeOut,
      },
      update: {
        paused,
        productions,
        tickFragment,
        now,
        tickRate,
        productionRate,
        starsForVictory,
        gameOver,
        started,
        startTime,
        totalStars,
        productionCounter,
        tradeScanned,
        tick,
        tradeCost,
        admin,
        playerUid,
        turnBased,
        war,
        turnBasedTimeOut,
      },
    });

    // Create a new GameSnapshot record
    await prisma.gameSnapshot.create({
      data: {
        gameId: game.id,
        tick,
        name,
        paused,
        productions,
        tickFragment,
        now,
        tickRate,
        productionRate,
        starsForVictory,
        gameOver,
        started,
        startTime,
        totalStars,
        productionCounter,
        tradeScanned,
        tradeCost,
        admin,
        playerUid,
        turnBased,
        war,
        turnBasedTimeOut,
        fleets,
        stars,
        players,
      },
    });

    await createOrUpdateFleetRecords(game, fleets, prisma);

    await createOrUpdateStarRecords(game, stars, prisma);

    await createOrUpdatePlayerRecords(game, players, prisma);

    console.log("Object successfully pushed to the database.");
  } catch (error) {
    console.error("Error pushing object to the database:", error);
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
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
        gameId_fleetId: { gameId: game.id, fleetId: parseInt(fleetId) },
      },
      create: {
        gameId: game.id,
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
      where: { gameId_starId: { gameId: game.id, starId: parseInt(starId) } },
      create: {
        gameId: game.id,
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
        gameId_playerId: { gameId: game.id, playerId: parseInt(playerId) },
      },
      create: {
        gameId: game.id,
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
