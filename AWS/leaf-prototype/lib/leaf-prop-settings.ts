import * as ecs from '@aws-cdk/aws-ecs';
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2';

const stackProps = {
    stackPrefix: 'leaf-ecs-fargate-stack',
    targetEnvironment: 'dev',
    imageBase: 'leaf-monolith',
    imageVersion: '1.0',
  };
  
const vpcProps = {
  dev: {
    vpcName: 'leaf-dev',
    vpcTags: {'working_name': `leaf-${stackProps.targetEnvironment}`},
    vpcId: 'vpc-445b8f2f',
    fileSystemSecurityGroupId: 'sg-01c57778',
  },
  pre_prod: {
    vpcName: 'leaf-preprod',
    vpcTags: {'working_name': `leaf-${stackProps.targetEnvironment}`},
    vpcId: 'vpc-445b8f2f',
    fileSystemSecurityGroupId: 'sg-01c57778'
  },
  prod: {
    vpcName: 'leaf-prod',
    vpcTags: {'working_name': `leaf-${stackProps.targetEnvironment}`},
    vpcId: 'vpc-445b8f2f',
    fileSystemSecurityGroupId: 'sg-01c57778'
  }
  
};

const elbProps = {
  port: 80,
  protocol: elb.ApplicationProtocol.HTTP,
  isInternetFacing: true,
  isListenerOpen: true,
};

const ecsTaskProps = {
  clusterName: `leaf-${stackProps.targetEnvironment}`,
  memoryLimitMiB: 512,
  cpuUnit: 256,
  containerImageName: 'leaf-monolith',
  containerImageVersion: '1.0',
  containerPort: 80,
  hostPort: 80,
  protocol: ecs.Protocol.TCP,
};

const ecsServiceProps = {
  serviceName: 'leaf-ecs-service',
  desiredCount: 1,
  maxHealthyPercent: 200,
  minHealthyPercent: 100,
  healthCheckGracePeriod: 90,
  assignPublicIp: false,
};

const efsProps = {
  fileSystemId: '123',
  efsVolumeName: 'leaf_efs_vol',
  containerPath: '/vol/www/',
  sourceVolume: 'leaf_efs_vol',
  isReadonly: false,
};

export * from './leaf-prop-settings'