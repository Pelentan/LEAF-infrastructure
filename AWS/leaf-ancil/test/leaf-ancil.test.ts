import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LeafAncil from '../lib/leaf-ancil-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LeafAncil.LeafAncilStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
