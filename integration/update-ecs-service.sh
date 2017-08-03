#!/usr/bin/env bash
#Script to update ECS Service Cloud Formation stack with a new image version.
#Input Parameters: <target stack name> <ecr repo uri> <image name> <company> <project> <environment> <iam role to assume>
#Input example: update-ecs-service.sh stPortalPreprod01-ecsServiceMachineAuthentication "629301634334.dkr.ecr.eu-west-1.amazonaws.com/ecrportaldev01t" machine-authentication-service_0.7.7.1 atoc portal preprod01 arn:aws:iam::963967427739:role/CA_JKN_DEV
#Script assumes bucket naming standards have been followed (e.g. s3-atoc-dcas-dev01=cloudformation)

set -e

echo "In updates-ecs-service.sh"
script_dir="$(dirname "$0")"
bin_dir="$(dirname $0)/../bin"

echo The value of arg 0 = $0
echo The value of arg 1 = $1
echo The value of arg 2 = $2
echo The value of arg 3 = $3
echo The value of arg 4 = $4
echo The value of arg 5 = $5
echo The value of arg 6 = $6
echo The value of arg 7 = $7
echo The value of arg script_dir = $script_dir

ECS_SERVICE_STACK=$1
ECR=$2
IMAGETAG=$3
COMPANY=$4
PROJECT=$5
ENV=$6
ROLE_ARN=$7
CFN_URL="https://s3-$COMPANY-$PROJECT-$ENV-cloudformation.s3-eu-west-1.amazonaws.com/resources/ecs/ecs-service.template"

echo The value of ECS SERVICE STACK is $ECS_SERVICE_STACK
echo The value of ECR is $ECR
echo The value of IMAGETAG is $IMAGETAG
echo The value of COMPANY is $COMPANY
echo The value of PROJECT is $PROJECT
echo The value of ENV is $ENV
echo The value of CFN_URL is $CFN_URL
echo The value of ROLE is $ROLE_ARN

#Call AWS STS to get temporary credentials

if [[ $ROLE_ARN ]]; then
aws sts assume-role --role-arn ${ROLE_ARN} \
    --role-session-name jenkins_ecs_update | \
    grep -w 'AccessKeyId\|SecretAccessKey\|SessionToken' | \
    awk '{print $2}' | sed 's/\"//g;s/\,//' > awscre; \
    export AWS_ACCESS_KEY_ID=`sed -n '3p' awscre`;\
    export AWS_SECRET_ACCESS_KEY=`sed -n '1p' awscre`;\
    export AWS_SECURITY_TOKEN=`sed -n '2p' awscre`
fi

aws cloudformation update-stack --stack-name $ECS_SERVICE_STACK --template-url $CFN_URL --region eu-west-1 --capabilities="CAPABILITY_IAM" --parameters \
ParameterKey=pDepends,UsePreviousValue=true \
ParameterKey=pAccountName,UsePreviousValue=true \
ParameterKey=pEnvironmentName,UsePreviousValue=true \
ParameterKey=pEnvironmentNumber,UsePreviousValue=true \
ParameterKey=pRole,UsePreviousValue=true \
ParameterKey=pVpcId,UsePreviousValue=true \
ParameterKey=pECSRepoUri,UsePreviousValue=true \
ParameterKey=pECSCluster,UsePreviousValue=true \
ParameterKey=pECSHostSubnetList,UsePreviousValue=true \
ParameterKey=pServiceName,UsePreviousValue=true \
ParameterKey=pDNSServiceName,UsePreviousValue=true \
ParameterKey=pServiceContainerPort,UsePreviousValue=true \
ParameterKey=pServiceRole,UsePreviousValue=true \
ParameterKey=pServiceDesiredCount,UsePreviousValue=true \
ParameterKey=pTaskDefinitionCpu,UsePreviousValue=true \
ParameterKey=pTaskDefinitionMemory,UsePreviousValue=true \
ParameterKey=pTaskDefinitionHostPort,UsePreviousValue=true \
ParameterKey=pTaskDefinitionImageTag,ParameterValue=$IMAGETAG \
ParameterKey=pTaskDefinitionEnv01Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv01Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv02Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv02Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv03Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv03Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv04Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv04Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv05Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv05Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv06Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv06Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv07Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv07Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv08Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv08Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv09Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv09Value,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv10Key,UsePreviousValue=true \
ParameterKey=pTaskDefinitionEnv10Value,UsePreviousValue=true \
ParameterKey=pLoadBalancerType,UsePreviousValue=true \
ParameterKey=pLoadBalancerScheme,UsePreviousValue=true \
ParameterKey=pLoadBalancerListenerInstancePort,UsePreviousValue=true \
ParameterKey=pLoadBalancerListenerProtocol,UsePreviousValue=true \
ParameterKey=pLoadBalancerHealthCheckPath,UsePreviousValue=true \
ParameterKey=pLoadBalancerHealthCheckPort,UsePreviousValue=true \
ParameterKey=pLoadBalancerHealthCheckProtocol,UsePreviousValue=true \
ParameterKey=pLoadBalancerHealthCheckHealthyThreshold,UsePreviousValue=true \
ParameterKey=pLoadBalancerHealthCheckUnhealthyThreshold,UsePreviousValue=true \
ParameterKey=pLoadBalancerHealthCheckInterval,UsePreviousValue=true \
ParameterKey=pLoadBalancerHealthCheckTimeout,UsePreviousValue=true \
ParameterKey=pLoadBalancerConnectionDrainingTimeout,UsePreviousValue=true \
ParameterKey=pAlbHealthCheckMatcherCode,UsePreviousValue=true \
ParameterKey=pAlbListener,UsePreviousValue=true \
ParameterKey=pAlbRulePath,UsePreviousValue=true \
ParameterKey=pAlbRulePriority,UsePreviousValue=true \
ParameterKey=pAlbStickyness,UsePreviousValue=true \
ParameterKey=pAlbStickyDuration,UsePreviousValue=true \

until echo $stackStatus | grep -e "UPDATE_COMPLETE$" -e "UPDATE_FAILED$" -e "UPDATE_ROLLBACK_COMPLETE$" -e "UPDATE_ROLLBACK_FAILED$"
do
    stackStatus=`aws cloudformation describe-stacks --region eu-west-1 --stack-name $ECS_SERVICE_STACK --query 'Stacks[*].[StackStatus]' --output text`
    if (( $? == 255 ));
        then
            exit 0
    fi
echo $stackStatus
sleep 30
done
if [ $stackStatus == "UPDATE_COMPLETE" ]
then
    echo "Stack update process COMPLETED successfully with status:" $stackStatus
    exit 0
else
    echo "Stack update process FAILED to complete with status:" $stackStatus
    exit 1
fi