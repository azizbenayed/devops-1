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
                echo '📦 Installing Node.js dependencies...'
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

        stage('Dependency Check (OWASP)') {
            steps {
                script {
                    def odcHome = tool 'dependency-check'

                    withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_KEY')]) {
                        sh """
                            ${odcHome}/bin/dependency-check.sh \
                            --project devops-1 \
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

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Trivy Security Scan') {
            steps {
                echo '🔐 Scanning Docker image with Trivy...'

                sh '''
                    mkdir -p trivy-report

                    trivy image \
                    --format template \
                    --template "@contrib/html.tpl" \
                    -o trivy-report/trivy-report.html \
                    $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Publish Trivy Report') {
            steps {
                publishHTML([
                    reportName: 'Trivy Security Report',
                    reportDir: 'trivy-report',
                    reportFiles: 'trivy-report.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }

        stage('Generate Final HTML Report') {
            steps {
                script {
                    def buildStatus = currentBuild.currentResult
                    def nodeVersion = sh(script: "node -v", returnStdout: true).trim()

                    writeFile file: 'report.html', text: """
                    <html>
                    <head>
                        <title>CI Pipeline Report</title>
                        <style>
                            body { font-family: Arial; background: #f4f4f4; padding: 30px; }
                            h1 { color: #333; }
                            .success { color: green; font-weight: bold; }
                            .failure { color: red; font-weight: bold; }
                            .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0px 0px 15px #ccc; }
                            .section { margin-bottom: 15px; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h1>🚀 CI/CD Pipeline Report</h1>

                            <div class="section"><strong>Project:</strong> devops-1</div>
                            <div class="section"><strong>Build Number:</strong> ${env.BUILD_NUMBER}</div>
                            <div class="section"><strong>Date:</strong> ${new Date()}</div>
                            <div class="section"><strong>Node Version:</strong> ${nodeVersion}</div>

                            <div class="section">
                                <strong>Status:</strong> 
                                <span class="${buildStatus == 'SUCCESS' ? 'success' : 'failure'}">
                                    ${buildStatus}
                                </span>
                            </div>

                            <div class="section">
                                <p>✔ SonarQube Analysis Executed</p>
                                <p>✔ OWASP Dependency Check Executed</p>
                                <p>✔ Docker Image Built</p>
                                <p>✔ Trivy Report Generated</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                }

                publishHTML([
                    reportName: 'CI Final Report',
                    reportDir: '.',
                    reportFiles: 'report.html',
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
