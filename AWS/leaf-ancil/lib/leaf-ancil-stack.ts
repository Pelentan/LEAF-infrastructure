// Manual imports
import * as cdk from '@aws-cdk/core';
import { Subnet, Volume, Vpc, SecurityGroup, Peer, Port, Connections } from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as cr from '@aws-cdk/custom-resources';
import * as ssm from '@aws-cdk/aws-ssm';


// Auto imports.
import { CfnParameter, Construct } from '@aws-cdk/core';
import { Ec2Service } from '@aws-cdk/aws-ecs';


export class LeafAncilStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    /**
     * Required contect variables:
     *    targetEnv (prod, preprod, dev, uat)
     *    orgName (text)
     *    
     * example build:  cdk deploy -c targetEnv=prod -c orgName=Vizn74
     */
    
    console.log(this.node.tryGetContext('orgName'));
    
    const tags = props?.tags;
    const target_env: string = this.node.tryGetContext('targetEnv');
    const build_vars = this.node.tryGetContext(target_env);
    const non_secure_env_vars = build_vars.non_secure_env_vars;
    const secure_env_vars = this.node.tryGetContext(`secure_env_vars`);
    const org_name = this.node.tryGetContext(`orgName`);

    const vpc_name: string = build_vars?.vpc_name ?? `leaf-dev`;    
    const vpc = Vpc.fromLookup(this, 'vpc', {
      tags: {"working_name": vpc_name}
    }); 

    console.log("target env: " + target_env);
    console.log("non secure env vars: " +non_secure_env_vars);
    console.log("didi: " + non_secure_env_vars.toga);


    /**
     * Builds the values in the Parameter Store for the specified target application runtime environment if not already built.
     * Is given as a string list that is defined in cdk.json.
     * This should also remove all variables in the list on AWS that are _not_ specified in cdk.json.  
     */

    // console.log(typeof(non_secure_env_vars));

    for (let key in non_secure_env_vars){
      let value = non_secure_env_vars[key] ? non_secure_env_vars[key] : "null";
      console.log(`key: ${key} val: ${value}`)
      new ssm.StringParameter(this, `ev_${key}`, {
        parameterName: key,
        stringValue: value
      })
    }

    /**
     * Creates the needed security groups
     */

    // SG for EC2.  Wide open
    const ec2_sg = new SecurityGroup(this, 'ec2_sg', {
      vpc: vpc,
      description: `Security group to allow ec2 to access efs`,
      securityGroupName: `ec2_sg`,
      allowAllOutbound: true
    })
    ec2_sg.addIngressRule(Peer.anyIpv4(), Port.tcp(22), `Allow ssh in`);
    const ec2_sg_id = ec2_sg.securityGroupId;

    // SG for EFS from EC2.  Locked to above SG for ingress.
    const efs_sg = new SecurityGroup(this, 'efs_sg', {
      vpc: vpc,
      description: `Security group for the efs to connect to ec2s`,
      securityGroupName: `efs_sg`,
      allowAllOutbound: true
    })
    efs_sg.connections.allowFrom(
      new Connections({
        securityGroups: [ec2_sg]
      }),
      Port.tcp(2049),
      `Allows traffic only from those with the correct security groups`
    )

    /**
     * Create EFS for specific Domain named by orgName input
     */

    const domain_efs = new efs.FileSystem(this, org_name, {
      fileSystemName: org_name,
      vpc: vpc,
      securityGroup: efs_sg,
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
      lifecyclePolicy: efs.LifecyclePolicy.AFTER_60_DAYS,
    })



    // const vpam  = ssm.StringParameter.fromStringParameterAttributes(this, 'vpam', {
    //   parameterName: '/leaf/vpc/prod'
    // });
    // new cdk.CfnOutput(this, 'jojowasafrog: ', {
    //   value: vpam.stringValue
    // })

   

    // const toga = ssm.StringParameter.fromStringParameterAttributes(this, 'toga', {
    //   parameterName: '/leaf/toga',
    //   simpleName: false
    // });
    // console.log("from ssm :  " + toga.stringValue)

    // const leaf_efs = new efs.FileSystem(this, 'leaf_filesystem', {
    //   fileSystemName: 'leaf-' + target_env +'-legacy-efs',
    //   vpc: vpc,
    //   enableAutomaticBackups: false,
    //   encrypted: true,
    //   lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS,
    //   performanceMode: efs.PerformanceMode.GENERAL_PURPOSE, 
    // });

    // new cdk.CfnOutput(this, 'bokoo: ', {
    //   value: leaf_efs.fileSystemId
    // })

    // let paraName = `/leaf/efs-${target_env}-legacy`;
    // let isstring = typeof paraName
    // new cdk.CfnOutput(this, 'paramTarget: ', {
    //   value: `${paraName} -- ${isstring}`,
    // });

    // // paraName = "/leaf/efs-prod-legacy";
    // const efs_id_param = new ssm.StringParameter(this, `efs-id_param`, {
    //   parameterName: paraName,
    //   description: `The efs id for the legacy in the ${target_env} environment/vpc`, 
    //   stringValue: leaf_efs.fileSystemId
    // });    


    // const appFiles = new efs.AccessPoint(this, 'app_access_point', {
    //   fileSystem: leaf_efs,
    //   path: "/leaf-app-files/",
    //   createAcl: {
    //     ownerUid: '1000',
    //     ownerGid: '1000',
    //     permissions: '755'
    //   },
    //   posixUser: {
    //     uid: '1000', 
    //     gid: '1000',
    //   }      
    // });



    // leaf_efs.addAccessPoint('app-files', {
    //   path: '/leaf-app-files/', 
    //   posixUser: {
    //     uid: '1000', 
    //     gid: '1000'
    //   }
    // });
    
  }
}