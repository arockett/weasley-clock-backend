import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as WeasleyClock from '../lib/weasley-clock-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new WeasleyClock.WeasleyClockStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
