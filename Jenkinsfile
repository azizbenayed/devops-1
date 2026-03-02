pipeline {
    agent any

    stages {

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                }
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t username/auth-service ./auth'
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push username/auth-service'
            }
        }
    }
}
