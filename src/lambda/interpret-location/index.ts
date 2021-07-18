import { Context } from 'aws-lambda';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import {
  isOwntracksLocationMessage,
  isOwntracksLwtMessage,
  isOwntracksTransitionMessage,
  OwntracksLocationMessage,
  OwntracksMessage,
  OwntracksTransitionEvent,
  OwntracksTransitionMessage,
  Status,
  StatusUpdateMessage,
  validateOwntracksMessage,
  WaypointLabel} from '/opt/nodejs/weasley-clock-types';
import { reverseGeocode } from './reverse-geocode';


const IoTDATA = new IoTDataPlaneClient({region: 'us-east-2'});

const HOME_LABELS = ['home', 'house'];
const FRIENDS_LABELS = ['friend'];
const FAMILY_LABELS = ['family'];
const WORK_LABLES = ['work', 'office'];
const GYM_LABLES = ['gym'];
const HAPPY_PLACE_LABLES = ['happy place'];


export async function handler(event: any, context: Context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  validateOwntracksMessage(event);

  const owntracksMsg: OwntracksMessage = event;

  if(isOwntracksLwtMessage(owntracksMsg.body)) {
    console.log(`Ignoring LWT message:\n${JSON.stringify(owntracksMsg, null, 2)}`);
    return
  }

  const user = getUserFromTopic(owntracksMsg.topic);
  const status: Status = await detectStatusFromOwntracksMsg(owntracksMsg.body);

  return await publishUserStatus(user, status);
}

export function getUserFromTopic(topic: string): string {
  return topic.split('/')[1];
}

export async function detectStatusFromOwntracksMsg(msg: OwntracksLocationMessage | OwntracksTransitionMessage): Promise<Status> {
  if (isOwntracksTransitionMessage(msg)) {
    return detectStatusFromTransitionEvent(msg);
  } else if (isOwntracksLocationMessage(msg)) {
    return detectStatusFromLocationUpdate(msg)
  } else {
    throw new Error(`Unable to detect status from owntracks message:\n${JSON.stringify(msg, null, 2)}`);
  }
}

export function detectStatusFromTransitionEvent(transitionEvent: OwntracksTransitionMessage): Status {
  const waypointLabel = detectWaypointLable(transitionEvent.desc);
  if (transitionEvent.event == OwntracksTransitionEvent.Enter) {
    return Status[waypointLabel];
  } else {
    return Status.InTransit;
  }
}

export async function detectStatusFromLocationUpdate(locationUpdate: OwntracksLocationMessage): Promise<Status> {
  if (locationUpdate.inregions !== undefined && locationUpdate.inregions.length >= 1) {
    const waypointLabel = detectWaypointLable(locationUpdate.inregions[0]);
    return Status[waypointLabel];
  }

  // Get user's home country
  const homeCountry = 'US';

  // Reverse geocode position
  const place = await reverseGeocode(locationUpdate.lon, locationUpdate.lat);

  if (place.atAirport) {
    return Status.Airport;
  } else if (place.atHospital) {
    return Status.Hospital;
  } else if (place.country != place.UnknownCountry && place.country != homeCountry) {
    return Status.Abroad;
  } else if (inTransit(locationUpdate)) {
    return Status.InTransit;
  } else {
    return Status.Out;
  }
}

export function detectWaypointLable(description: string): WaypointLabel {

  const descriptionStartsWithAnyOf = (prefixes: string[]) => {
    return startsWithAnyOf(description.toLowerCase().replace(/^the /, ''), prefixes);
  }

  if (descriptionStartsWithAnyOf(HOME_LABELS)) {
    return WaypointLabel.Home
  } else if (descriptionStartsWithAnyOf(FRIENDS_LABELS)) {
    return WaypointLabel.Friends
  } else if (descriptionStartsWithAnyOf(FAMILY_LABELS)) {
    return WaypointLabel.Family
  } else if (descriptionStartsWithAnyOf(WORK_LABLES)) {
    return WaypointLabel.Work
  } else if (descriptionStartsWithAnyOf(GYM_LABLES)) {
    return WaypointLabel.Gym
  } else if (descriptionStartsWithAnyOf(HAPPY_PLACE_LABLES)) {
    return WaypointLabel.HappyPlace
  } else {
    throw new Error(`Can't detect WaypointLabel for [${description}]`);
  }
}

function startsWithAnyOf(target: string, prefixes: string[]): boolean {
  return prefixes.some(prefix => {
    return target.startsWith(prefix);
  });
}

export function inTransit(msg: OwntracksLocationMessage): boolean {
  return msg.vel >= 3;
}

/*
 * Impure functions, they talk to the dirty outside world!
 */
async function publishUserStatus(user: string, status: Status) {
  const payload: StatusUpdateMessage = {
    user: user,
    status: status
  }
  const updateTopic = `weasleyclock/${user}/status`;

  console.log(`STATUS UPDATE for [${user}] on [${updateTopic}]:\n${JSON.stringify(payload, null, 2)}`);

  try {
    const response = await IoTDATA.send(new PublishCommand({
      topic: updateTopic,
      payload: Buffer.from(JSON.stringify(payload, null, 2)),
      qos: 0
    }));
    console.log(response);
  } catch (err) {
    console.log(err, err.stack);
  }
}