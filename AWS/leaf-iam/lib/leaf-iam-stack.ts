import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class LeafIamStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Need to create an IAM user and security id/key for access by CDK
     * 
     * This is literally a chicken and egg situation.  AWS CLI, therefore CDK, can't work without it.  VA 
     * has creating it locked out.  So going to try to use CDK to create the CloudFormation stack and deploy
     * that way to create the IAM and Role so that an id and key can be created to allow access for CDK
     */

    const admin_group = iam.Group.fromGroupArn(this, 'admin_group','arn:aws:iam::456456143286:group/admin')

    const leaf_cdk_admin = new iam.User(this, 'leaf_cdk_admin', {
      userName: 'leaf-cdk-admin',
      groups: [admin_group]
    })
  }
}
