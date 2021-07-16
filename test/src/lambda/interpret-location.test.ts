import { OwntracksLocationMessage, OwntracksMessageType } from 'src/layers/weasley-clock-types/nodejs/weasley-clock-types/owntracks-types';
import * as interpretLoc from '../../../src/lambda/interpret-location';

/*
 * getUserFromTopic
 */
test('getUserFromTopic extracts user string from owntracks topic', () => {
  // WHEN
  const user = 'USER';
  const topic = `owntracks/${user}/device`;
  // THEN
  expect(interpretLoc.getUserFromTopic(topic)).toBe(user);
});

/*
 * inTransit
 */
test('inTransit is True when velocity > 3', () => {
  // WHEN
  const msg: OwntracksLocationMessage = {
    _type: OwntracksMessageType.Location,
    tst: Math.floor(Date.now()),
    lat: 40,
    lon: 50,
    vel: 5
  };
  // THEN
  expect(interpretLoc.inTransit(msg)).toBeTruthy();
});

test('inTransit is True when velocity = 3', () => {
  // WHEN
  const msg: OwntracksLocationMessage = {
    _type: OwntracksMessageType.Location,
    tst: Math.floor(Date.now()),
    lat: 40,
    lon: 50,
    vel: 3
  };
  // THEN
  expect(interpretLoc.inTransit(msg)).toBeTruthy();
});

test('inTransit is False when velocity < 3', () => {
  // WHEN
  const msg: OwntracksLocationMessage = {
    _type: OwntracksMessageType.Location,
    tst: Math.floor(Date.now()),
    lat: 40,
    lon: 50,
    vel: 2
  };
  // THEN
  expect(interpretLoc.inTransit(msg)).toBeFalsy();
});