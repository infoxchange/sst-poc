import {SSTConfig} from "sst";
import {NextjsSite} from "sst/constructs";
import {Vpc, SubnetType, SecurityGroup} from "aws-cdk-lib/aws-ec2";

export default {
    config(_input) {
        return {
            name: "sstpoc",
            region: "ap-southeast-2",
        };
    },
    stacks(app) {
        app.stack(function Site({stack}) {
            const vpc = Vpc.fromLookup(stack, "Vpc", {
                vpcName: 'SstPocCdk-Vpc',
            });
            const site = new NextjsSite(stack, "site", {
                cdk: {
                    server: {
                        vpc,
                        securityGroups: [SecurityGroup.fromLookupByName(stack, "LambdaSecurityGroup", "SstPocCdk-LambdaSecurityGroup", vpc)],
                    }
                }
            });

            stack.addOutputs({
                SiteUrl: site.url,
            });
        });
    },
} satisfies SSTConfig;
