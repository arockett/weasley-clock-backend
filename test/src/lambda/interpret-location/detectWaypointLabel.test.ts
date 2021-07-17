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

test('Friends detected when waypoint desc is "friend\'s house"', () => {
  // WHEN
  const waypointDescription = 'friend\'s house';
  // THEN
  expect(interpretLoc.detectWaypointLable(waypointDescription)).toBe(WaypointLabel.Friends);
})

test('Family detected when waypoint desc is "family"', () => {
  // WHEN
  const waypointDescription = 'family';
  // THEN
  expect(interpretLoc.detectWaypointLable(waypointDescription)).toBe(WaypointLabel.Family);
})

test('Work detected when waypoint desc is "the office"', () => {
  // WHEN
  const waypointDescription = 'the office';
  // THEN
  expect(interpretLoc.detectWaypointLable(waypointDescription)).toBe(WaypointLabel.Work);
})

test('Gym detected when waypoint desc is "the gym"', () => {
  // WHEN
  const waypointDescription = 'the gym';
  // THEN
  expect(interpretLoc.detectWaypointLable(waypointDescription)).toBe(WaypointLabel.Gym);
})

test('Happy Place detected when waypoint desc is "happy place"', () => {
  // WHEN
  const waypointDescription = 'happy place';
  // THEN
  expect(interpretLoc.detectWaypointLable(waypointDescription)).toBe(WaypointLabel.HappyPlace);
})

test('Throws error when waypoint desc does not match anthing', () => {
  // WHEN
  const waypointDescription = 'Unmatchable';
  // THEN
  expect(() => {
    interpretLoc.detectWaypointLable(waypointDescription)
  }).toThrow();
})