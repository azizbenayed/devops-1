pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        IMAGE_NAME = "devops-1"
        IMAGE_TAG  = "1.0"
        CONTAINER_NAME = "authentication"
    }

    options {
        timestamps()
    }

    stages {

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies'
                sh 'node -v'
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                script {
                    def odcHome = tool 'dependency-check'

                    sh 'mkdir -p dependency-check-report'

                    withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_KEY')]) {
                        sh """
                        ${odcHome}/bin/dependency-check.sh \
                        --project devops-1 \
                        --scan . \
                        --format HTML \
                        --out dependency-check-report \
                        --disableYarnAudit \
                        --nvdApiKey $NVD_KEY
                        """
                    }
                }
            }
        }

        stage('Publish OWASP Report') {
            steps {
                publishHTML([
                    reportDir: 'dependency-check-report',
                    reportFiles: 'dependency-check-report.html',
                    reportName: 'OWASP Dependency Check Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker Image'
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Trivy Security Scan') {
            steps {
                echo '🔐 Running Trivy Scan'

                sh '''
                mkdir -p trivy-report

                trivy image \
                --format template \
                --template "@/usr/local/share/trivy/templates/html.tpl" \
                -o trivy-report/trivy-report.html \
                $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Publish Trivy Report') {
            steps {
                publishHTML([
                    reportDir: 'trivy-report',
                    reportFiles: 'trivy-report.html',
                    reportName: 'Trivy Security Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true
                ])
            }
        }

    }

    post {

        always {
            echo '🧹 Cleaning container'
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
