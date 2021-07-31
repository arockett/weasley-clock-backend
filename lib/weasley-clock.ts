import * as cdk from '@aws-cdk/core';
import { WeasleyClockInfStack } from './weasley-clock-inf-stack';
import { WeasleyClockControlPlaneStack } from './weasley-clock-cp-stack';

export class WeasleyClock extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    defineWeasleyClockResources(this, props);
  }
}

export function defineWeasleyClockResources(scope: cdk.Construct, props?: cdk.StageProps) {

  const infStack = new WeasleyClockInfStack(scope, 'WeasleyClock-Inf', {
    terminationProtection: false
  });

  const cpStack = new WeasleyClockControlPlaneStack(scope, 'WeasleyClock-ControlPlane', {
    infStack: infStack
  });

  cpStack.addDependency(infStack);
}