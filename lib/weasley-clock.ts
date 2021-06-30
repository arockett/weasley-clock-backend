import * as cdk from '@aws-cdk/core';
import { WeasleyClockInfStack } from './weasley-clock-inf-stack';

export class WeasleyClock extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new WeasleyClockInfStack(this, 'Inf', {
      terminationProtection: false
    });
  }
}
