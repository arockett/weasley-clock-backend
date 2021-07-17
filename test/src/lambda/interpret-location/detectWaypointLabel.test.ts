import * as interpretLoc from 'src/lambda/interpret-location';
import { WaypointLabel } from 'src/layers/weasley-clock-types/nodejs/weasley-clock-types/app-types';

test('Home detected when waypoint desc is "Home"', () => {
  // WHEN
  const waypointDescription = 'Home';
  // THEN
  expect(interpretLoc.detectWaypointLable(waypointDescription)).toBe(WaypointLabel.Home);
})

test('Home detected when waypoint desc is "home"', () => {
  // WHEN
  const waypointDescription = 'home';
  // THEN
  expect(interpretLoc.detectWaypointLable(waypointDescription)).toBe(WaypointLabel.Home);
})

test('Home detected when waypoint desc is "House"', () => {
  // WHEN
  const waypointDescription = 'House';
  // THEN
  expect(interpretLoc.detectWaypointLable(waypointDescription)).toBe(WaypointLabel.Home);
})

test('Throws error when waypoint desc does not match anthing', () => {
  // WHEN
  const waypointDescription = 'Unmatchable';
  // THEN
  expect(() => {
    interpretLoc.detectWaypointLable(waypointDescription)
  }).toThrow();
})