#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LeafAppLegacyStack } from '../lib/leaf-app-legacy-stack';

const app = new cdk.App();
new LeafAppLegacyStack(app, 'LeafAppLegacyStack', {  
  env: { 
    account: '456456143286', 
    region: 'us-east-1' 
  },
});
