#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { defineWeasleyClockResources } from '../lib/weasley-clock';

const app = new cdk.App();

defineWeasleyClockResources(app);