#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LeafNfsStack } from '../lib/leaf-nfs-stack';

const app = new cdk.App();
new LeafNfsStack(app, 'LeafNfsStack', {
  env: { 
    account: '456456143286', 
    region: 'us-east-1',
  },
  tags: {
    "environment": "prod"
  }
});
