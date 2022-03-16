import { StackProps } from "aws-cdk-lib";   
import * as ecs from '@aws-cdk/aws-ecs';
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2';
import { EfsFileSystemLocationProps } from "aws-cdk-lib/aws-codebuild";

interface PipelineStackProps extends StackProps {
    readonly stackPrefix: string;
    readonly account?: string;
    readonly region?: string;
    readonly targetEnvironment: string;
    readonly imageBase: string;
    readonly imageVersion: string;
}

interface VpcProps {
    readonly vpcName: string;
    readonly vpcTags: {};
    readonly vpcId: string;
    readonly fileSystemSecurityGroupId: string;
}

interface ElbProps {
    readonly port: number;
    readonly protocol: elb.ApplicationProtocol;
    readonly isInternetFacing: boolean;
    readonly isListenerOpen: boolean;
}

interface EcsTaskProps {
    readonly clusterName: string;
    readonly memoryLimitMiB: number;
    readonly cpuUnit: number;
    readonly containerImageName: string;
    readonly containerImageVersion: string;
    readonly containerPort: number;
    readonly hostPort: number;
    readonly protocol: ecs.Protocol;
}

interface EcsServiceProps {
    readonly serviceName: string;
    readonly desiredCount: number;
    readonly maxHealthyPercent: number;
    readonly minHealthyPercent: number;
    readonly healthCheckGracePeriod: number;
    readonly assignPublicIp: boolean;
}

interface EfsProps {
    readonly fileSystemId: string;
    readonly efsVolumeName: string;
    readonly containerPath: string;
    readonly sourceVolume: string;
    readonly isReadonly: boolean;
}

export interface EcsFargateStackProps extends PipelineStackProps {
    readonly vpcProps: VpcProps;
    readonly elbProps: ElbProps;
    readonly ecsTaskProps: EcsTaskProps
    readonly ecsServiceProps: EcsServiceProps;
    readonly efsProps: EfsProps;
}

export * from './leaf-props-interfaces'
