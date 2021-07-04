import { Context } from 'aws-lambda';

exports.handler =  async function(event: any, context: Context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  return context.logStreamName;
}