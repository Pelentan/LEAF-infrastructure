import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LeafIam from '../lib/leaf-iam-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LeafIam.LeafIamStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
