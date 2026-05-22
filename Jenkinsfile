pipeline {
    agent any
    environment {
        DOCKER_LOGIN   = credentials('dockerhub')
        CREDENTIALS_ID = '850d941b-7a1b-479d-8e1d-6b0d40b89d68'
        PROJECT_ID     = 'sonsaekim-ai'
        CLUSTER_NAME   = 'k8s'
        LOCATION       = 'asia-northeast3-a'
        IMAGE_NAME     = 'mminnn28/sswu_sonsaekim-progress'
    }
    stages {
        stage('Build') {
            steps {
                echo '도커 이미지 빌드 중...'
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }
        stage('Push') {
            steps {
                echo 'DockerHub 푸시 중...'
                sh 'echo $DOCKER_LOGIN_PSW | docker login -u $DOCKER_LOGIN_USR --password-stdin'
                sh 'docker push $IMAGE_NAME:latest'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Kubernetes 배포 중...'
                sh '''
                    gcloud container clusters get-credentials $CLUSTER_NAME \
                        --zone $LOCATION \
                        --project $PROJECT_ID
                    kubectl apply -f k8s/progress-deployment.yaml
                    kubectl rollout restart deployment/progress-service
                    kubectl rollout status deployment/progress-service
                '''
            }
        }
    }
    post {
        success {
            echo '✅ 배포 성공'
        }
        failure {
            echo '❌ 배포 실패'
        }
    }
}
