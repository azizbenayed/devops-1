pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        IMAGE_NAME = "auth-service"
        IMAGE_TAG  = "1.0"
        CONTAINER_NAME = "authentication"
        SERVICE_DIR = "auth"
    }

    options {
        timestamps()
    }

    stages {

        stage('Install Dependencies') {
            steps {
                dir("${SERVICE_DIR}") {
                    echo '📦 Installing Node.js dependencies...'
                    sh 'node -v'
                    sh 'npm install'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir("${SERVICE_DIR}") {
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        withSonarQubeEnv('sonarqube') {
                            sh "${scannerHome}/bin/sonar-scanner"
                        }
                    }
                }
            }
        }

        stage('Dependency Check (OWASP)') {
            steps {
                dir("${SERVICE_DIR}") {
                    script {
                        def odcHome = tool 'dependency-check'

                        withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_KEY')]) {
                            sh """
                                ${odcHome}/bin/dependency-check.sh \
                                --project auth-service \
                                --scan . \
                                --format HTML \
                                --out dependency-check-report \
                                --disableYarnAudit \
                                --nvdApiKey $NVD_KEY \
                                --failOnCVSS 7
                            """
                        }
                    }

                    publishHTML([
                        reportName: 'Dependency Check Report',
                        reportDir: 'dependency-check-report',
                        reportFiles: 'dependency-check-report.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true,
                        allowMissing: true
                    ])
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir("${SERVICE_DIR}") {
                    echo '🐳 Building Docker image...'
                    sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                echo '🔐 Scanning Docker image with Trivy...'
                sh '''
                    mkdir -p trivy-report

                    trivy image \
                    --scanners vuln \
                    --format json \
                    -o trivy-report/trivy-report.json \
                    $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Publish Trivy Report') {
            steps {
                publishHTML([
                    reportName: 'Trivy Security Report',
                    reportDir: 'trivy-report',
                    reportFiles: 'trivy-report.json',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning test container'
            sh 'docker rm -f $CONTAINER_NAME || true'
        }

        success {
            echo '✅ CI PIPELINE SUCCESS'
        }

        failure {
            echo '❌ CI PIPELINE FAILED'
        }
    }
}
