pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKERHUB_USERNAME = "mohamedaziz599"
        TAG = "v${env.BUILD_NUMBER}"
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

                            def scannerHome = tool 'sonar-scanner'

                            withSonarQubeEnv('sonarqube') {
                                sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=${service} \
                                -Dsonar.projectName=${service} \
                                -Dsonar.sources=.
                                """
                            }

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


        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                    """
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

                    sh "mkdir -p trivy-reports"

                    for (service in services) {

                        dir(service) {

                            if (fileExists('Dockerfile')) {

                                def IMAGE_NAME = "${DOCKERHUB_USERNAME}/microservises-devops"
                                def FULL_IMAGE = "${IMAGE_NAME}:${service}-${TAG}"

                                echo "🐳 Building ${FULL_IMAGE}"

                                sh """
                                docker build -t ${FULL_IMAGE} .
                                docker push ${FULL_IMAGE}
                                """

                                echo "🔐 Running Trivy scan on ${FULL_IMAGE}"

                                sh """
                                trivy image \
                                --severity HIGH,CRITICAL \
                                --format template \
                                --template "@contrib/html.tpl" \
                                -o ../trivy-reports/trivy-report-${service}.html \
                                ${FULL_IMAGE}
                                """
                            } 
                            else {
                                echo "⚠️ No Dockerfile found for ${service}, skipping"
                            }
                        }
                    }
                }
            }
        }


        stage('Publish Trivy Report') {
            steps {
                publishHTML(target: [
                    reportDir: 'trivy-reports',
                    reportFiles: 'trivy-report-*.html',
                    reportName: 'Trivy Security Reports',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true
                ])
            }
        }


        stage('Docker Logout') {
            steps {
                sh "docker logout"
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

