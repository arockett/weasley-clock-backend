import { Context } from 'aws-lambda';
import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';

exports.handler = async function(event: any, context: Context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const iotdata = new IoTDataPlaneClient({region: 'us-east-2'});

  try {
    const response = await iotdata.send(new PublishCommand({
      topic: 'weasleyclock/rockettman/status',
      payload: Buffer.from(JSON.stringify(event, null, 2)),
      qos: 0
    }));
    console.log(response);
  } catch (err) {
    console.log(err, err.stack);
  }

  return context.logStreamName;
}
