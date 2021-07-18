import * as cdk from '@aws-cdk/core';
import { WeasleyClockInfStack } from './weasley-clock-inf-stack';
import { WeasleyClockControlPlaneStack } from './weasley-clock-cp-stack';

export class WeasleyClock extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const infStack = new WeasleyClockInfStack(this, 'Inf', {
      terminationProtection: false
    });

    const cpStack = new WeasleyClockControlPlaneStack(this, 'ControlPlane', {
      infStack: infStack
    });

    cpStack.addDependency(infStack);
  }
}
