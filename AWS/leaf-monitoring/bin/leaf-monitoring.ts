#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LeafMonitoringStack } from '../lib/leaf-monitoring-stack';

const app = new cdk.App();
new LeafMonitoringStack(app, 'LeafMonitoringStack', {
  env: { 
    account: '456456143286', 
    region: 'us-east-1',
  },
  tags: {
    "environment": "prod"
  }
});
