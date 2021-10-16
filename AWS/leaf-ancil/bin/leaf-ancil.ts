#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LeafAncilStack } from '../lib/leaf-ancil-stack';

const app = new cdk.App();

new LeafAncilStack(app, 'LeafAncilStack', {
  env: { 
    account: '456456143286', 
    region: 'us-east-1',
  },
  tags: {
    "environment": "prod"
  }
});
