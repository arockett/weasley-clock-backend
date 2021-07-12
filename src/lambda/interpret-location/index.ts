import { Context } from 'aws-lambda';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import { isOwntracksLocationMessage, isOwntracksTransitionMessage, OwntracksMessage, OwntracksMessageType, validateOwntracksMessage } from '/opt/nodejs/weasley-clock-types';

export async function handler(event: any, context: Context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  validateOwntracksMessage(event);

  const owntracksMessage: OwntracksMessage = event;

  let messageType = 'other';
  if (isOwntracksLocationMessage(owntracksMessage.body)) {
    messageType = OwntracksMessageType.Location;
  } else if (isOwntracksTransitionMessage(owntracksMessage.body)) {
    messageType = OwntracksMessageType.Transition
  }

  const iotdata = new IoTDataPlaneClient({region: 'us-east-2'});

  try {
    const response = await iotdata.send(new PublishCommand({
      topic: 'weasleyclock/rockettman/status',
      payload: Buffer.from(JSON.stringify({msgType: messageType}, null, 2)),
      qos: 0
    }));
    console.log(response);
  } catch (err) {
    console.log(err, err.stack);
  }

  return context.logStreamName;
}
