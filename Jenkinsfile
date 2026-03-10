pipeline {

    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKERHUB_USERNAME = "mohamedaziz599"
        TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
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
                mkdir -p trivy-template
                mkdir -p trivy-reports

                curl -L https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl \
                -o trivy-template/html.tpl
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

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

                        echo "Running security scan for ${service}"

                        dir(service) {

                            // SonarQube
                            def scannerHome = tool 'sonar-scanner'
                            withSonarQubeEnv('sonarqube') {

                                sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=${service} \
                                -Dsonar.projectName=${service} \
                                -Dsonar.sources=.
                                """
                            }

                            // OWASP Dependency Check
                            def odcHome = tool 'dependency-check'

                            sh """
                            ${odcHome}/bin/dependency-check.sh \
                            --project ${service} \
                            --scan . \
                            --format HTML \
                            --out dependency-check-report \
                            --data ${ODC_DATA}
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

                            def IMAGE = "${DOCKERHUB_USERNAME}/${service}:${TAG}"

                            if (fileExists('Dockerfile')) {

                                sh """
                                echo "Building image ${IMAGE}"

                                docker build -t ${IMAGE} .
                                docker push ${IMAGE}

                                echo "Running Trivy scan"

                                trivy image \
                                --scanners vuln \
                                --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
                                --format template \
                                --template "@../trivy-template/html.tpl" \
                                --output ../trivy-reports/trivy-${service}.html \
                                ${IMAGE}
                                """

                            } else {

                                echo "No Dockerfile found for ${service}"

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
            echo "Pipeline DevSecOps terminé avec succès"
        }

        failure {
            echo "Pipeline échoué"
        }

    }
}
