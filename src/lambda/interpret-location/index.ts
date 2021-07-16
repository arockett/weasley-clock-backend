import { Context } from 'aws-lambda';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import {
  isOwntracksLocationMessage,
  isOwntracksTransitionMessage,
  OwntracksLocationMessage,
  OwntracksMessage,
  OwntracksTransitionMessage,
  Status,
  StatusUpdateMessage,
  validateOwntracksMessage } from '/opt/nodejs/weasley-clock-types';


const IoTDATA = new IoTDataPlaneClient({region: 'us-east-2'});

export async function handler(event: any, context: Context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  validateOwntracksMessage(event);

  const owntracksMsg: OwntracksMessage = event;

  const user = getUserFromTopic(owntracksMsg.topic);
  const status: Status = detectStatusFromOwntracksMsg(owntracksMsg);

  return await publishUserStatus(user, status);
}

export function getUserFromTopic(topic: string): string {
  return topic.split('/')[1];
}

export function detectStatusFromOwntracksMsg(msg: OwntracksMessage): Status {
  if (isOwntracksTransitionMessage(msg.body)) {
    return detectStatusFromTransitionEvent(msg.body);
  } else if (isOwntracksLocationMessage(msg.body)) {
    return detectStatusFromLocationUpdate(msg.body)
  } else {
    throw new Error(`Unable to detect status from owntracks message:\n${JSON.stringify(msg.body, null, 2)}`);
  }
}

export function detectStatusFromTransitionEvent(transitionEvent: OwntracksTransitionMessage): Status {
  return Status.Home;
}

export function detectStatusFromLocationUpdate(locationUpdate: OwntracksLocationMessage): Status {
  return Status.Out;
}

export function detectWaypointLable(description: string) {
}

export function inTransit(msg: OwntracksLocationMessage): boolean {
  return msg.vel >= 3;
}

export function atAirport(msg: any) {
}

export function atHospital(msg: any) {
}

export function inHomeCountry(msg: any) {
}

export async function publishUserStatus(user: string, status: Status) {
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