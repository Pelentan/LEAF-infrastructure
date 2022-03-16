import * as cdk from '@aws-cdk/core';
import {Vpc} from '@aws-cdk/aws-ec2';

export class LeafMonitoringStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tags = props?.tags;
    const target_env: string = this.node.tryGetContext('targetEnv');
    const build_vars = this.node.tryGetContext(target_env);
    const non_secure_env_vars = build_vars.non_secure_env_vars;
    const secure_env_vars = this.node.tryGetContext(`secure_env_vars`);

    const vpc_name: string = build_vars?.vpc_name ?? `leaf-dev`;    
    const vpc = Vpc.fromLookup(this, 'vpc', {
      tags: {"working_name": vpc_name}
    }); 

    console.log("target env: " + target_env);
    console.log("non secure env vars: " +non_secure_env_vars);
    console.log("didi: " + non_secure_env_vars.toga);
  }
}
