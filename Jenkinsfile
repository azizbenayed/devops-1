pipeline {

    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKERHUB_USERNAME = "azizbenayed"
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

        stage('Install Trivy Template') {
            steps {
                sh '''
                mkdir -p trivy-template
                curl -L https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl -o trivy-template/html.tpl
                mkdir -p trivy-reports
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
            parallel {

                stage('auth') {
                    steps {
                        dir('auth') {
                            script {
                                runSecurityScan("auth")
                            }
                        }
                    }
                }

                stage('client') {
                    steps {
                        dir('client') {
                            script {
                                runSecurityScan("client")
                            }
                        }
                    }
                }

                stage('expiration') {
                    steps {
                        dir('expiration') {
                            script {
                                runSecurityScan("expiration")
                            }
                        }
                    }
                }

                stage('image') {
                    steps {
                        dir('image') {
                            script {
                                runSecurityScan("image")
                            }
                        }
                    }
                }

                stage('orders') {
                    steps {
                        dir('orders') {
                            script {
                                runSecurityScan("orders")
                            }
                        }
                    }
                }

                stage('payments') {
                    steps {
                        dir('payments') {
                            script {
                                runSecurityScan("payments")
                            }
                        }
                    }
                }

                stage('tickets') {
                    steps {
                        dir('tickets') {
                            script {
                                runSecurityScan("tickets")
                            }
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
                                echo "Building ${IMAGE}"

                                docker build -t ${IMAGE} .
                                docker push ${IMAGE}

                                echo "Running Trivy Scan"

                                trivy image \
                                --severity HIGH,CRITICAL \
                                --format template \
                                --template "@../trivy-template/html.tpl" \
                                -o ../trivy-reports/trivy-${service}.html \
                                ${IMAGE}
                                """

                            } else {
                                echo "No Dockerfile for ${service}"
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

def runSecurityScan(service){

    def scannerHome = tool 'sonar-scanner'
    def odcHome = tool 'dependency-check'

    withSonarQubeEnv('sonarqube') {

        sh """
        ${scannerHome}/bin/sonar-scanner \
        -Dsonar.projectKey=${service} \
        -Dsonar.projectName=${service} \
        -Dsonar.sources=.
        """
    }

    sh """
    ${odcHome}/bin/dependency-check.sh \
    --project ${service} \
    --scan . \
    --format HTML \
    --out dependency-check-report \
    --data /var/lib/jenkins/dependency-check-data
    """
}
