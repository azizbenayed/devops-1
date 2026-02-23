pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    options {
        timestamps()
    }

    stages {

        stage('Build All Microservices') {
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

                        stage("Install ${service}") {
                            dir(service) {
                                echo "📦 Installing dependencies for ${service}"
                                sh "npm install"
                            }
                        }

                        stage("SonarQube ${service}") {
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
                            }
                        }

                        stage("OWASP ${service}") {
                            dir(service) {
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

                        stage("Docker Build ${service}") {
                            dir(service) {
                                sh "docker build -t ${service}:${IMAGE_TAG} ."
                            }
                        }

                        stage("Trivy Scan ${service}") {
                            sh """
                                trivy image \
                                --scanners vuln \
                                ${service}:${IMAGE_TAG}
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ ALL MICROSERVICES BUILT SUCCESSFULLY"
        }
        failure {
            echo "❌ PIPELINE FAILED"
        }
    }
}
