#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LeafAncilStack } from '../lib/leaf-ancil-stack';

const app = new cdk.App();

new LeafAncilStack(app, 'LeafAncilStack', {
  env: { 
    account: '873629351884', 
    region: 'us-gov-west-1',
  },
  tags: {
    "environment": "prod"
  }
});
