#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { WeasleyClockPipeline } from '../lib/pipeline-stack';

const app = new cdk.App();

new WeasleyClockPipeline(app, 'WeasleyClockPipeline', {
  env: {account: '033318137562', region: 'us-east-2'}
});
