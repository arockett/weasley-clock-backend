import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class WeasleyClockInfStack extends cdk.Stack {

  readonly database: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.database = new dynamodb.Table(this, "Database", {
      partitionKey: {
        name: "partitionKey",
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: "sortKey",
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}
