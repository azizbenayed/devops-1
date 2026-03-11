pipeline {

    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKERHUB_USERNAME = "mohamedaziz599"
        TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Trivy Template') {
            steps {
                sh '''
                mkdir -p trivy-template
                mkdir -p trivy-reports

                curl -L https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl \
                -o trivy-template/html.tpl
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Docker Build + Push + Trivy') {

            steps {

                script {

                    def services = [
                        "auth",
                        "client",
                        "expiration",
                        "image",
                        "orders",
                        "payments",
                        "tickets"
                    ]

                    for (service in services) {

                        dir(service) {

                            def IMAGE = "${DOCKERHUB_USERNAME}/${service}:${TAG}"

                            if (fileExists('Dockerfile')) {

                                sh """

                                echo "Building ${IMAGE}"

                                docker build -t ${IMAGE} .

                                docker push ${IMAGE}

                                echo "Running Trivy scan"

                                mkdir -p ../trivy-reports

                                trivy image \
                                --scanners vuln \
                                --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
                                --format template \
                                --template "@../trivy-template/html.tpl" \
                                --output ../trivy-reports/trivy-${service}.html \
                                ${IMAGE}

                                ls -lh ../trivy-reports

                                """

                            }

                        }

                    }

                }

            }

        }

        stage('Publish Trivy Reports') {
            steps {
                publishHTML([
                    reportDir: 'trivy-reports',
                    reportFiles: 'trivy-*.html',
                    reportName: 'Trivy Security Reports',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true
                ])
            }
        }

        stage('Docker Logout') {
            steps {
                sh 'docker logout'
            }
        }

    }

    post {

        success {
            echo "Pipeline test Trivy terminé avec succès"
        }

        failure {
            echo "Pipeline échoué"
        }

    }

}
