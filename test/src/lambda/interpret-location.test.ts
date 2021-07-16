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