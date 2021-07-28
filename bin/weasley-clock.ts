#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { defineWeasleyClockResources, WeasleyClock } from '../lib/weasley-clock';

const app = new cdk.App();

new WeasleyClock(app, 'WeasleyClock');
//defineWeasleyClockResources(app);