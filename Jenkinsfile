pipeline {

    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKERHUB_USERNAME = "mohamedaziz599"
        TAG = "${env.BUILD_NUMBER}"
        ODC_DATA = "/var/lib/jenkins/dependency-check-data"
        TRIVY_CACHE = "/tmp/trivy-cache"
    }

    options {
        timestamps()
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Tools') {
            steps {
                sh '''
                docker --version
                node --version
                npm --version
                trivy --version
                '''
            }
        }

        stage('Prepare Reports') {
            steps {
                sh '''
                mkdir -p trivy-template trivy-reports dependency-check-report
                if [ ! -f trivy-template/html.tpl ]; then
                  curl -L https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl -o trivy-template/html.tpl
                fi
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
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('sonarqube') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=microservices-devops \
                          -Dsonar.projectName=microservices-devops \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=**/node_modules/**,**/dependency-check-report/**,**/trivy-reports/**
                        """
                    }
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                script {
                    def odcHome = tool 'dependency-check'

                    withCredentials([string(credentialsId: 'NVD_API_KEY', variable: 'NVD_API_KEY')]) {
                        sh """
                        ${odcHome}/bin/dependency-check.sh \
                          --project microservices-devops \
                          --scan auth client orders payments tickets expiration image \
                          --format HTML \
                          --out dependency-check-report \
                          --data ${ODC_DATA} \
                          --nvdApiKey \$NVD_API_KEY \
                          --disableRetireJS
                        """
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
                            def IMAGE = "${DOCKERHUB_USERNAME}/${service}:${TAG}"
                            def IMAGE_LATEST = "${DOCKERHUB_USERNAME}/${service}:latest"

                            if (fileExists('Dockerfile')) {
                                sh """
                                docker pull ${IMAGE_LATEST} || true

                                docker build \
                                  --cache-from=${IMAGE_LATEST} \
                                  -t ${IMAGE} \
                                  -t ${IMAGE_LATEST} .

                                docker push ${IMAGE}
                                docker push ${IMAGE_LATEST}

                                trivy image \
                                  --scanners vuln \
                                  --severity HIGH,CRITICAL \
                                  --exit-code 0 \
                                  --cache-dir ${TRIVY_CACHE} \
                                  --format template \
                                  --template "@../trivy-template/html.tpl" \
                                  --output ../trivy-reports/trivy-${service}.html \
                                  ${IMAGE}
                                """
                            } else {
                                echo "No Dockerfile found for ${service}, skipping."
                            }
                        }
                    }
                }
            }
        }

        stage('Publish Reports') {
            steps {
                publishHTML([
                    reportDir: 'dependency-check-report',
                    reportFiles: 'dependency-check-report.html',
                    reportName: 'OWASP Dependency Check Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true
                ])

                publishHTML([
                    reportDir: 'trivy-reports',
                    reportFiles: 'trivy-*.html',
                    reportName: 'Trivy Reports',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true
                ])
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }

        success {
            echo "Pipeline DevSecOps SUCCESS"
        }

        failure {
            echo "Pipeline FAILED"
        }
    }
}
