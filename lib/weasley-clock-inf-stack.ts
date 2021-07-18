import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as location from '@aws-cdk/aws-location';

export class WeasleyClockInfStack extends cdk.Stack {

  readonly database: dynamodb.Table;
  readonly placeIndex: location.CfnPlaceIndex;

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

    this.placeIndex = new location.CfnPlaceIndex(this, "PlaceIndex", {
      // Must manually bump version in indexName anytime PlaceIndex changes
      // because CF will try to fully replace resource and fail if the name is
      // the same as the existing PlaceIndex and CDK doesn't auto-generate a unique
      // name for this resource.
      indexName: 'v1PlaceIndex',
      description: 'Support reverse geocoding requests used to interpret location updates',
      dataSource: 'Esri',
      dataSourceConfiguration: {
        intendedUse: 'SingleUse'
      },
      pricingPlan: 'RequestBasedUsage'
    });
  }
}
