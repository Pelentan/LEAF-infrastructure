import * as cdk from '@aws-cdk/core';
import { SecurityGroup, Volume, Vpc } from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs_pats from '@aws-cdk/aws-ecs-patterns';
import * as ssm from '@aws-cdk/aws-ssm';

// Auto imports.
import { Repository } from '@aws-cdk/aws-ecr';
// yw. line #1 included all modules in CDK core, so the import below is not needed
// yw. use cdk.Duration instead
// import { Duration } from '@aws-cdk/aws-iam/node_modules/@aws-cdk/core';

export class LeafAppLegacyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    /**
     * Required contect variables:
     *    targetEnv (prod, preprod, dev, uat)
     *    
     * example build:  cdk deploy -c targetEnv=prod -c orgName=Vizn74
     */

    // Build out the variables going to be used
    // yw. the question mark makes props? nullable
    // yw. the tags seem not have been used
    const tags = props?.tags;

    // yw. the string type seems to be unnecessary
    // yw. TypeScript will assign the type based on the value type on the right
    // const target_env: string = this.node.tryGetContext('targetEnv');
    const target_env = this.node.tryGetContext('targetEnv');
    
    // yw. is there a context variable named "[pre]prod/dev/uat" in cdk.json
    // yw. given the command line: cdk deploy -c targetEnv=prod -c orgName=Vizn74
    // yw. below context variable should exist in cdk.json
    // yw. according to line 54 build_vars should be a json object and can't be null
    const build_vars = this.node.tryGetContext(target_env);


    // Build out the AWS handles for objects already existing in AWS
    // yw. the line below provides default vpc name which is good
    // yw. again the string type is unnecessary
    const vpc_name: string = build_vars?.vpc_name ?? `leaf-dev`;

    // yw. cautious! make sure the VPC with the above name exists in the deployed account-region
    const vpc = Vpc.fromLookup(this, 'vpc', {
      tags: {"working_name": vpc_name}
    });

    // yw. cautious! make sure build_vars has valid values
    const leaf_image: string = `${build_vars?.image_base ?? `leaf-monolith`}:${build_vars?.image_version ?? `1.0`}`;
    // yw. what's the value leaf_image?
    console.log(`Image to build with: ${leaf_image}`);
    // yw. could you confirm what's assigned to leaf_initial_image?
    const leaf_initial_image = ecs.ContainerImage.fromEcrRepository(
      Repository.fromRepositoryName(this, 'leaf-monolith-img', leaf_image)
    );

    // yw. let's discuss about coding practices
    const leaf_efs_id: string = build_vars?.efs_id;
    const leaf_efs_sec_group: string = build_vars?.efs_sec_group;
    const leaf_efs = efs.FileSystem.fromFileSystemAttributes(this, "efs", {
      fileSystemId: leaf_efs_id,
      securityGroup: SecurityGroup.fromLookup(this, 'efs_sg', leaf_efs_sec_group),
    });

    const leaf_efs_vol_config = {
      name: 'leaf_efs_vol', 
      efsVolumeConfiguration: {fileSystemId: leaf_efs.fileSystemId}
    }

    const leaf_efs_mounts = [
      {
        containerPath: '/vol/www/',
        sourceVolume: leaf_efs_vol_config.name,
        readOnly: 'false'
      }
    ];


    //  Setting up the alb
    const leaf_alb = elb.ApplicationLoadBalancer.fromLookup(this, 'yubyub', {
      loadBalancerTags: {
        "env": target_env
      },
    });

    const leaf_alb_listener = leaf_alb.addListener('leaf_listner', {
      port: 80,
      open: true,
    })

    // yw. this is the first launching statement so far
    // yw. the above are all pulling the existing resources
    // yw. for example line #85 gets the existing ALB
    // yw. can't tell what's this new ALB for
    const lb = new elb.ApplicationLoadBalancer(this, 'LB', {
      vpc: vpc,
      internetFacing: true
    });
    
    leaf_alb_listener.addTargetGroups('default', {
      targetGroups: [
        new elb.ApplicationTargetGroup(this, 'default', {
          vpc: vpc,
          protocol: elb.ApplicationProtocol.HTTP,
          port: 80
        })
      ]
    })
    
    // Cluster
    const leaf_cluster = new ecs.Cluster(this, 'leaf_cluster', {
      vpc: vpc,
      clusterName: 'leaf-' + target_env + '-cluster'
    });

    new cdk.CfnOutput(this, 'alb-arn', {
      value: leaf_alb.loadBalancerArn
    })

    //  Create the LEAF ECS 



    // Task Creation(s)
    const app_task = new ecs.FargateTaskDefinition(this, 'app-task-def', {
      memoryLimitMiB: 512,
      cpu: 256,
      volumes: [leaf_efs_vol_config]
    });

    const app_container = app_task.addContainer('leaf-app-leg', {
      image: leaf_initial_image,
      memoryLimitMiB: 256,
      cpu: 256,
      containerName: "leaf-app-leg",
    });

    app_container.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: ecs.Protocol.TCP,
    });


    // // Service(s) creation
    const leaf_service = new ecs.FargateService(this, 'leaf-mit-efs', {
      serviceName: 'leaf-mit-efs',
      cluster: leaf_cluster,
      taskDefinition: app_task,
      desiredCount: 1,
      maxHealthyPercent: 200,
      minHealthyPercent: 100,
      assignPublicIp: false,
      // yw. commented out and replaced this line by the line below healthCheckGracePeriod: Duration.seconds(90), 
      healthCheckGracePeriod: cdk.Duration.seconds(90),
    });



  }
}
