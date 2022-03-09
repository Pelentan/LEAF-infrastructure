// import { Stack, StackProps } from 'aws-cdk-lib';
// import { Construct } from 'constructs';
import { Construct, Stack } from '@aws-cdk/core';
import { Vpc, SecurityGroup } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as efs from '@aws-cdk/aws-efs';

import { EcsFargateStackProps } from './leaf-props-interfaces'
import * as lSet from './leaf-prop-settings'
import { Repository } from 'aws-cdk-lib/aws-ecr';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LeafPrototypeStack extends Stack {
  constructor(scope: Construct, id: string, props?: EcsFargateStackProps) {
    super(scope, id, {env: { account: props?.account, region: props?.region}});

    const work_env: string = props?.targetEnvironment ?? "dev";

    const vpc_name = props?.vpcProps.vpcName ?? "leaf-dev"
    const vpc = Vpc.fromLookup(this, 'vpc', {
      tags: {"working_name": vpc_name}
    });

    const leaf_image: string = `${props?.ecsTaskProps.containerImageName ?? 'leaf-monolith'}:${props?.ecsTaskProps.containerImageVersion ?? '1.0'}`;
    const leaf_initial_imagea = ecs.ContainerImage.fromEcrRepository(
      Repository.fromRepositoryName(this, 'leaf-monolith-img', leaf_image)
    );

    const leaf_efs = efs.FileSystem.fromFileSystemAttributes(this, "efs", {
      fileSystemId: props?.efsProps.fileSystemId,
      securityGroup: SecurityGroup.fromSecurityGroupId(this, 'efs_sg', props.vpcProps.fileSystemSecurityGroupId),
    });


  }
}
