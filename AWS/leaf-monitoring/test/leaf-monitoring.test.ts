import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LeafMonitoring from '../lib/leaf-monitoring-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LeafMonitoring.LeafMonitoringStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
