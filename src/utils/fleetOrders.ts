import { getTimeToArrivalForFleet } from "./coordinates";
import { getStar } from "./prismaUtil";
import { Coord, DBFleetOrder, Fleet, FleetOrder, OrderType } from "./types";

// TODO: fix the root DB type
export function processDBOrder(fleetOrder: DBFleetOrder) {
  return {
    // @ts-ignore
    delayInTicks: fleetOrder[0],
    // @ts-ignore
    starId: fleetOrder[1],
    // @ts-ignore
    orderType: OrderType[fleetOrder[2]],
    // @ts-ignore
    numberOfShips: fleetOrder[3],
  } as FleetOrder;
}

async function getOrderArrivalTime(
  fleetOrder: FleetOrder,
  gameStateTime: number,
  fleetCoordinates: Coord,
  inWarp: number
) {
  // get star coord
  const star = await getStar(fleetOrder.starId);
  if (!star.x || !star.y) {
    throw new Error("No star coordinates found");
  }
  const starCoordinates: Coord = { x: Number(star.x), y: Number(star.y) };

  const timeToArrival = getTimeToArrivalForFleet(
    gameStateTime,
    fleetCoordinates,
    starCoordinates,
    inWarp
  );
  return timeToArrival;
}

async function getFleetArrivalTime(fleet: Fleet, gameStateTime: number) {
  if (!fleet.o || !(fleet.w === 1 || fleet.w === 0) || fleet.o?.length === 0)
    return null;
  const firstOrder = fleet.o[0];
  const fleetCoordinates: Coord = { x: Number(fleet.x), y: Number(fleet.y) };
  const inWarp = fleet.w;

  const firstOrderArrivalTime = await getOrderArrivalTime(
    firstOrder,
    gameStateTime,
    fleetCoordinates,
    inWarp
  );
  return firstOrderArrivalTime;
}

export async function getFleetData(fleets: Fleet[], gameStateTime: number) {
  const fleetsOrderData = await Promise.all(
    fleets.map(async (fleet: Fleet) => {
      if (!fleet.o || fleet.o.length === 0) return null;
      const fleetOrder = fleet.o[0];
      const star = await getStar(fleetOrder.starId);
      const name = star.n;
      const starStrength = star.st;
      const fleetStrength = fleet.st;
      const ownedBy = star.puid;
      const timeToArrival = await getFleetArrivalTime(fleet, gameStateTime);
      return {
        starName: name,
        ownedBy: ownedBy,
        starStrength: starStrength,
        fleetStrength: fleetStrength,
        // TODO: fix names
        arrivalDate: timeToArrival,
      };
    })
  );
  return fleetsOrderData;
}
