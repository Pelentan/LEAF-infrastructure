import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Vpc } from '@aws-cdk/aws-ec2';

export class LeafNfsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);    
    
    const tags = props?.tags;
    const target_env: string = this.node.tryGetContext('targetEnv');
    const build_vars = this.node.tryGetContext(target_env);
    const vpc_name: string = build_vars?.vpc_name ?? `leaf_dev`;

    console.log(build_vars?.efs_name);
    
    const vpc = ec2.Vpc.fromLookup(this, `vpc`, {
      vpcName: vpc_name
    })

    const nfs_sec_group = new ec2.SecurityGroup(this, `nfs_sec_group`, {
      vpc: vpc,
      securityGroupName: `nfs_sec_group`,
      description: `This is the security group for the nfs`,
      allowAllOutbound: true
    })
  }
}
