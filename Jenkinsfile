def isPullRequest
def ecr = '845221390844.dkr.ecr.eu-west-1.amazonaws.com/ecrdcasdevtest'
def version = '0.0.9-SNAPSHOT'
def imagePrefix = 'rdg-frontend-dcas'

node {
    try {
        stage('Configure') {
            setupEnv()
            isPullRequest = env.BRANCH_NAME.startsWith('PR-')
            echo "Starting pipeline for DCAS Ui version ${version}_${env.BUILD_NUMBER}"

            def nodeHome = tool name: 'NodeJs', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
            env.PATH = "${nodeHome}/bin:${env.PATH}"
            sh "node -v"
        }

        stage('Checkout') {
            echo "Checking out the source code" 
            checkout scm   
        }

        // is done inside the docker image
        // stage('Build Bff') {
        //     echo "Building Bff" 
        //     dir ('dcas-bff') {
        //         sh 'npm install'
        //         sh 'npm run build'
        //     }
        // }

        stage('Build Ui') {
            echo "Building Ui"   
            dir ('dcas-ui') {
                sh 'npm install'
                sh 'npm run build'
            } 
        }

        lock('Docker') {

            stage('Build Docker Images') {
                echo "Building Docker Images"  
                sh 'docker-compose build'
                sh 'docker images'
            }

            //if (env.BRANCH_NAME.equals("develop")) {
                //   stage('Push images to ECR') {
                //         echo "Pushing images to ECR"  
                //         sh "/usr/local/bin/aws s3 cp s3://s3-kcom-maven-atocportaltest/release/com/kcom/common/aws-deployment-tool/0.0.33/aws-deployment-tool-0.0.33.jar ./aws-deployment-tool.jar"
                //         sh "java -jar aws-deployment-tool.jar pushToEcr --imagePrefix ${imagePrefix}/ --tag ${version} --ecr ${ecr} --ecrTagVersion ${version}_${env.BUILD_NUMBER}"
                //   }
            //}

            def awsAccessKeyId
            def awsSecretAccessKey
            def awsSessionToken
            // def props = readProperties file: './integration/jenkins/jobs/deploy.properties' 
            def imageVersion = "${version}_${env.BUILD_NUMBER}"

            stage('Set AWS Assumed Roles') {
                sh "aws sts assume-role --role-arn 'arn:aws:iam::845221390844:role/CA_JKN_DEV' --role-session-name 'cs-dcas-jenkins' --output text | tail -n 1 | awk '{print \$2; print \$4; print \$5}' > .env"
                def awsEnv = readFile('.env').trim()
                awsAccessKeyId = awsEnv.readLines()[0]
                awsSecretAccessKey = awsEnv.readLines()[1]
                awsSessionToken = awsEnv.readLines()[2]
            }

            withEnv(["AWS_ACCESS_KEY_ID=$awsAccessKeyId",
                        "AWS_SECRET_ACCESS_KEY=$awsSecretAccessKey",
                        "AWS_SESSION_TOKEN=$awsSessionToken"]) {

                stage('Download aws-development-tool') {
                    sh "/usr/local/bin/aws s3 cp s3://s3-kcom-maven-dcasdev/release/com/kcom/common/aws-deployment-tool/0.0.56/aws-deployment-tool-0.0.56.jar ./aws-deployment-tool.jar"
                }

                stage('Push Images To ECR') {
                    sh "java -jar aws-deployment-tool.jar pushToEcr --imagePrefix ${imagePrefix}/ --tag ${version} --ecr ${ecr} --ecrTagVersion ${imageVersion}"
                }

                stage('Deploy Services On AWS') {
                //    parallel(
                            images: {
                                sh "java -jar aws-deployment-tool.jar deployImages --ecr ${ecr} --version ${imageVersion} --environment test --company atoc --project dcas --parallelDeployments 5 --scriptLocation integration/update-ecs-service.sh"
                            },
                    //         lambda: {
                    //             sh "java -jar aws-deployment-tool.jar updateLambdaFunction --functionName dcas-lambda-sdci01-${environment['name']} --zipFile code/sales-data-capture/sdci-plus-file-listener/target/sdci-plus-file-listener-${version}.jar"
                    //         }
                    // )
                }  

            }
            // stage('Clean') {
            //     sh 'docker images | grep ^{imagePrefix}/ | grep SNAPSHOT | awk {\'print $3\'} | xargs --no-run-if-empty docker rmi -f'
            // }   
        }

    }
    catch (e) {
        throw e
    }
    finally {
        if (isPullRequest) {
            stage('Delete Workspace') {
                try {
                    deleteDir()
                } catch (e) {
                    throw e
                }
            }
        }
    }
}

void setupEnv() {

  // Get the jdk tool
  // NOTE: This 'jdk8-u92' jdk tool must be configured in the global configuration.
  env.JAVA_HOME = "${tool 'jdk8-u92'}"
  env.PATH = "${env.JAVA_HOME}/bin:${env.PATH}"
  env.PATH = "/usr/local/bin:${env.PATH}"
  env.DOCKER_IP = "127.0.0.1"
  env.COMPOSE_PROJECT_NAME = "rdg-frontend-dcas"
}