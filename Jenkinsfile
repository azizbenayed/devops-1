pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKERHUB_USERNAME = "azizbenayed"
        TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    options {
        timestamps()
    }

    stages {
        stage('SonarQube + OWASP') {
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

                        echo "🔍 Running Sonar + OWASP for ${service}"

                        dir(service) {

                            // SONAR
                            def scannerHome = tool 'sonar-scanner'
                            withSonarQubeEnv('sonarqube') {
                                sh """
                                    ${scannerHome}/bin/sonar-scanner \
                                    -Dsonar.projectKey=${service} \
                                    -Dsonar.projectName=${service} \
                                    -Dsonar.sources=.
                                """
                            }

                            // OWASP
                            def odcHome = tool 'dependency-check'
                            sh """
                                ${odcHome}/bin/dependency-check.sh \
                                --project ${service} \
                                --scan . \
                                --format HTML \
                                --out dependency-check-report
                            """
                        }
                    }
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

                            def IMAGE_NAME = "${DOCKERHUB_USERNAME}/${service}"
                            def FULL_IMAGE = "${IMAGE_NAME}:${TAG}"

                            if (fileExists('Dockerfile')) {

                                withCredentials([usernamePassword(
                                    credentialsId: 'dockerhub-cred',
                                    usernameVariable: 'DOCKER_USER',
                                    passwordVariable: 'DOCKER_PASS'
                                )]) {

                                    sh """
                                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                                        docker build -t ${FULL_IMAGE} .
                                        docker push ${FULL_IMAGE}
                                        docker logout
                                    """
                                }

                                echo "🔐 Running Trivy for ${FULL_IMAGE}"
                                sh "trivy image ${FULL_IMAGE}"

                            } else {
                                echo "⚠️ No Dockerfile found for ${service}, skipping"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ ALL MICROSERVICES PROCESSED SUCCESSFULLY"
        }
        failure {
            echo "❌ PIPELINE FAILED"
        }
    }
}
