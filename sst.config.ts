import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

export default {
  config(_input) {
    return {
      name: "sstpoc",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: "sst-poc.cals.cafe",
          isExternalDomain: true,
          cdk: {
            certificate: Certificate.fromCertificateArn(stack, "MyCert", "arn:aws:acm:us-east-1:228636184609:certificate/2ea84b6a-ef7d-41c0-83e6-94970b545bc1"),
          },
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
