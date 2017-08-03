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
              stage('Push images to ECR') {
                    echo "Pushing images to ECR"  
                    sh "/usr/local/bin/aws s3 cp s3://s3-kcom-maven-atocportaltest/release/com/kcom/common/aws-deployment-tool/0.0.33/aws-deployment-tool-0.0.33.jar ./aws-deployment-tool.jar"
                    sh "java -jar aws-deployment-tool.jar pushToEcr --imagePrefix ${imagePrefix}/ --tag ${version} --ecr ${ecr} --ecrTagVersion ${version}_${env.BUILD_NUMBER}"
              }
          //}

          //stage('Clean') {
            // sh 'docker images | grep ^portal/ | grep SNAPSHOT | awk {\'print $3\'} | xargs --no-run-if-empty docker rmi -f'
          //}

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
  env.COMPOSE_PROJECT_NAME = "rdg-frontend-portal"
}