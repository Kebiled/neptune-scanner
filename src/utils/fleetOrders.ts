import { getTimeToArrivalForFleet } from "./coordinates";
import { getStar } from "./prismaUtil";
import { Coord, DBFleetOrder, Fleet, FleetOrder, OrderType } from "./types";

export function processDBOrder(fleetOrder: DBFleetOrder) {
  return {
    delayInTicks: fleetOrder[0],
    starId: fleetOrder[1],
    orderType: OrderType[fleetOrder[2]],
    numberOfShips: fleetOrder[3],
  } as FleetOrder;
}

async function getOrderArrivalTime(
  dBFleetOrder: DBFleetOrder,
  gameStateTime: number,
  fleetCoordinates: Coord,
  inWarp: number
) {
  const fleetOrder = processDBOrder(dBFleetOrder);

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
  const firstOrder: DBFleetOrder = fleet.o[0];
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
      const fleetOrder = processDBOrder(fleet.o[0]);
      const star = await getStar(fleetOrder.starId);
      const name = star.n;
      const ownedBy = star.puid;
      const timeToArrival = await getFleetArrivalTime(fleet, gameStateTime);
      return {
        starName: name,
        ownedBy: ownedBy,
        timeToArrival: timeToArrival,
      };
    })
  );
  return fleetsOrderData;
}
