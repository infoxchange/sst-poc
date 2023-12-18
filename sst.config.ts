import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import { Vpc, SubnetType } from "aws-cdk-lib/aws-ec2";


export default {
  config(_input) {
    return {
      name: "sst-poc",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {

      const vpc = Vpc.fromLookup(stack, "myVPC", { vpcId: "vpc-0449d00f66f3c503d" });
      const vpcSubnets = {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      };
      const site = new NextjsSite(stack, "site", {
        cdk: {
          server: {
            vpc,
            vpcSubnets,
          },
          revalidation: {
            vpc,
            vpcSubnets,
          }
        },
        // customDomain: {
        //   domainName: "sst-poc.cals.cafe",
        //   isExternalDomain: true,
        //   cdk: {
        //     certificate: Certificate.fromCertificateArn(stack, "MyCert", "arn:aws:acm:us-east-1:228636184609:certificate/2ea84b6a-ef7d-41c0-83e6-94970b545bc1"),
        //   },
        // },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
