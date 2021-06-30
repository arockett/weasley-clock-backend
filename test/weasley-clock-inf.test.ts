import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { WeasleyClockInfStack } from '../lib/weasley-clock-inf-stack';

test('Has Database', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new WeasleyClockInfStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource('AWS::DynamoDB::Table'));
});
