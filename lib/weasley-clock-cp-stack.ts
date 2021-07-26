import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iot from '@aws-cdk/aws-iot';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import { Duration } from '@aws-cdk/core';
import { WeasleyClockInfStack } from './weasley-clock-inf-stack';

export interface WeasleyClockControlPlaneStackProps extends cdk.StackProps {
  readonly infStack: WeasleyClockInfStack;
}

export class WeasleyClockControlPlaneStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: WeasleyClockControlPlaneStackProps) {
    super(scope, id, props);

    const placeIndex = props.infStack.placeIndex;

    /*
     * Define Lambda Layers
     */
    const weasleyClockTypesLayer = new lambda.LayerVersion(this, 'WeasleyClockTypes', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      code: lambda.Code.fromAsset('src/layers/weasley-clock-types'),
      description: 'Contains types used by the WeasleyClock App'
    });

    /*
     * Interpret Raw Location updates as Clock status
     */
    const locInterpretLambda = new lambda.Function(this, 'InterpretLocation', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('src/lambda/interpret-location'),
      handler: 'index.handler',
      layers: [weasleyClockTypesLayer],
      environment: {
        "PLACE_INDEX_NAME": placeIndex.indexName
      },
      timeout: Duration.seconds(3),
      memorySize: 128,
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_MONTH
    });
    locInterpretLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['iot:Publish'],
      resources: [`arn:aws:iot:${this.region}:${this.account}:topic/weasleyclock/*/status`]
    }));
    locInterpretLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['geo:SearchPlaceIndexForPosition'],
      resources: [placeIndex.attrIndexArn]
    }));

    const sendLocUpdatesRule = new iot.CfnTopicRule(this, 'SendLocationUpdatesForInterpretation', {
      topicRulePayload: {
        description: 'Send location messages to Lambda funtion to convert to a weasley clock status',
        sql: 'SELECT topic() as topic, * as body FROM "owntracks/+/+"',
        awsIotSqlVersion: '2016-03-23',
        ruleDisabled: false,
        actions: [
          {lambda: {functionArn: locInterpretLambda.functionArn}}
        ]
      }
    });

    const sendLocEventsRule = new iot.CfnTopicRule(this, 'SendLocationEventsForInterpretation', {
      topicRulePayload: {
        description: 'Send transition messages to Lambda function to convert to a weasley clock status',
        sql: 'SELECT topic() as topic, * as body FROM "owntracks/+/+/event"',
        awsIotSqlVersion: '2016-03-23',
        ruleDisabled: false,
        actions: [
          {lambda: {functionArn: locInterpretLambda.functionArn}}
        ]
      }
    });

    locInterpretLambda.addPermission('AllowInvokeFromLocUpdates', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
      sourceAccount: `${this.account}`,
      sourceArn: `${sendLocUpdatesRule.attrArn}`
    });
    locInterpretLambda.addPermission('AllowInvokeFromLocEvents', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
      sourceAccount: `${this.account}`,
      sourceArn: `${sendLocEventsRule.attrArn}`
    });
  }
}