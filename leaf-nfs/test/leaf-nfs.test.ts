import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LeafNfs from '../lib/leaf-nfs-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LeafNfs.LeafNfsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
