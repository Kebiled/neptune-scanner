import { Coord } from "./types";

const LIGHT_YEAR_CONVERTER = 8; // 8 LY per 1 on coordinates grid
const REGULAR_SPEED = 1 / 3; // 0.33 per tick
const WARP_SPEED = 1; // 1LY per tick
const TICK_LENGTH_SECONDS = 3600; // 1hr per tick
// TODO: add tick rate to the above ^

// TODO: calculations seem messy

function getTravelTimeToDestination(
  startCoords: Coord,
  endCoords: Coord,
  inWarp: number
) {
  const speed = inWarp === 1 ? WARP_SPEED : REGULAR_SPEED;
  const distance = getLYDistance(startCoords, endCoords);
  const time = distance / speed;

  // TODO: process time
  return time * TICK_LENGTH_SECONDS;
}

function getLYDistance(startCoords: Coord, endCoords: Coord) {
  const dx = Math.abs(endCoords.x - startCoords.x);
  const dy = Math.abs(endCoords.y - startCoords.y);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const distanceInLY = distance * LIGHT_YEAR_CONVERTER;
  return distanceInLY;
}

// TODO: fix this with the millisecond thing going on
export function getTimeToArrivalForFleet(
  gameStateTime: number,
  fleetCoordinates: Coord,
  starCoordinates: Coord,
  inWarp: number
) {
  const gameStateTimeInMS = Math.floor(gameStateTime);
  const travelTimeInMS =
    getTravelTimeToDestination(fleetCoordinates, starCoordinates, inWarp) *
    1000;
  const arrivalTime = gameStateTimeInMS + travelTimeInMS;
  const arrivalDate = new Date(arrivalTime);
  const now = Date.now();
  // const secondsToArrival = (arrivalDate.getTime() - now) / 1000;
  const seconds = (arrivalDate.getTime() - now) / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  return arrivalDate;
  // return hours;
}
