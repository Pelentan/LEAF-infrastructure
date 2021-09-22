// Manual imports
import * as cdk from '@aws-cdk/core';
import { Subnet, Volume, Vpc } from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as cr from '@aws-cdk/custom-resources';
import * as ssm from '@aws-cdk/aws-ssm';


// Auto imports.
import { CfnParameter, Construct } from '@aws-cdk/core';


export class LeafAncilStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const targetEnv = new cdk.CfnParameter(this, 'targetEnv', {
    //   type: 'String',
    //   description: 'The name of the environment to put this in.',
    // });
    
    console.log(this.node.tryGetContext('orgName'));
    
    const tags = props?.tags;
    const target_env: string = this.node.tryGetContext('targetEnv');
    const build_vars = this.node.tryGetContext(target_env);

    const testVals: string = this.node.tryGetContext('jojo');
    console.log(testVals ?? "Nothing found");

    console.log(target_env);
    console.log(build_vars?.efs_name);

    const vpam  = ssm.StringParameter.fromStringParameterAttributes(this, 'vpam', {
      parameterName: '/leaf/vpc/prod'
    });
    new cdk.CfnOutput(this, 'jojowasafrog: ', {
      value: vpam.stringValue
    })

    const vpc_name: string = build_vars?.vpc_name ?? `leaf-dev`;
    const vpc = Vpc.fromLookup(this, 'external-vpc', {
      vpcName: vpc_name
    });    

    const toga = ssm.StringParameter.fromStringParameterAttributes(this, 'toga', {
      parameterName: '/leaf/toga',
      simpleName: false
    });
    console.log("from ssm :  " + toga.stringValue)

    const leaf_efs = new efs.FileSystem(this, 'leaf_filesystem', {
      fileSystemName: 'leaf-' + target_env +'-legacy-efs',
      vpc: vpc,
      enableAutomaticBackups: false,
      encrypted: true,
      lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS,
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE, 
    });

    new cdk.CfnOutput(this, 'bokoo: ', {
      value: leaf_efs.fileSystemId
    })

    new cdk.CfnOutput(this, "paramter-pull", {
      value: toga.stringValue,
    })

    let paraName = `/leaf/efs-${target_env}-legacy`;
    let isstring = typeof paraName
    new cdk.CfnOutput(this, 'paramTarget: ', {
      value: `${paraName} -- ${isstring}`,
    });

    // paraName = "/leaf/efs-prod-legacy";
    const efs_id_param = new ssm.StringParameter(this, `efs-id_param`, {
      parameterName: paraName,
      description: `The efs id for the legacy in the ${target_env} environment/vpc`, 
      stringValue: leaf_efs.fileSystemId
    });    


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