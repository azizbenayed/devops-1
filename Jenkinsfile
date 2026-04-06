pipeline {

    agent any

    tools {
        nodejs 'node20' 
    }

    environment {
        DOCKERHUB_USERNAME = "mohamedaziz599"
        TAG = "${env.BUILD_NUMBER}"
        ODC_DATA = "/var/lib/jenkins/dependency-check-data"
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
                mkdir -p trivy-template trivy-reports
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

        stage('OWASP Dependency Check (FAST)') {
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
                        --noupdate \
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

                            if (fileExists('Dockerfile')) {

                                sh """
                                docker build -t ${IMAGE} .
                                docker push ${IMAGE}

                                trivy image \
                                --scanners vuln \
                                --severity HIGH,CRITICAL \
                                --format template \
                                --template "@../trivy-template/html.tpl" \
                                --output ../trivy-reports/trivy-${service}.html \
                                ${IMAGE}
                                """
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
                    reportName: 'OWASP Report',
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

        stage('Docker Logout') {
            steps {
                sh 'docker logout'
            }
        }
    }

    post {
        success {
            echo "Pipeline DevSecOps SUCCESS"
        }
        failure {
            echo "Pipeline FAILED"
        }
    }
}
