import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iot from '@aws-cdk/aws-iot';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as path from 'path';
import { Duration } from '@aws-cdk/core';

export class WeasleyClockControlPlaneStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*
     * Interpret Raw Location updates as Clock status
     */
    const locInterpretLambda = new lambda.Function(this, 'InterpretLocation', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'interpret-location')),
      handler: 'index.handler',
      timeout: Duration.seconds(3),
      memorySize: 128,
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_MONTH
    });
    locInterpretLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['iot:Publish'],
      resources: ['arn:aws:iot:us-east-2:682946798041:topic/weasleyclock/*/status']
    }));

    const sendLocUpdatesRule = new iot.CfnTopicRule(this, 'SendLocationUpdatesForInterpretation', {
      topicRulePayload: {
        description: 'Send location messages to Lambda funtion to convert to a weasley clock status',
        sql: 'SELECT topic() as topic, * as owntracksMsg FROM "owntracks/+/+"',
        ruleDisabled: false,
        actions: [
          {lambda: {functionArn: locInterpretLambda.functionArn}}
        ]
      }
    });

    const sendLocEventsRule = new iot.CfnTopicRule(this, 'SendLocationEventsForInterpretation', {
      topicRulePayload: {
        description: 'Send transition messages to Lambda function to convert to a weasley clock status',
        sql: 'SELECT topic() as topic, * as owntracksMsg FROM "owntracks/+/+/event"',
        ruleDisabled: false,
        actions: [
          {lambda: {functionArn: locInterpretLambda.functionArn}}
        ]
      }
    });

    locInterpretLambda.addPermission('AllowInvokeFromLocUpdates', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
      sourceAccount: '682946798041',
      sourceArn: `${sendLocUpdatesRule.attrArn}`
    });
    locInterpretLambda.addPermission('AllowInvokeFromLocEvents', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
      sourceAccount: '682946798041',
      sourceArn: `${sendLocUpdatesRule.attrArn}`
    });
  }
}