pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        IMAGE_NAME = "devops-1"
        IMAGE_TAG  = "1.0"
        CONTAINER_NAME = "devops-1-ci"
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
                            --noupdate \
                            --failOnCVSS 11
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
                sh 'trivy image --severity HIGH,CRITICAL $IMAGE_NAME:$IMAGE_TAG || true'
            }
        }

        stage('Smoke Test (Container Run)') {
            steps {
                echo '🧪 Running container smoke test...'
                sh '''
                  docker rm -f $CONTAINER_NAME || true

                  docker run -d \
                    --name $CONTAINER_NAME \
                    -p 3001:3000 \
                    -e JWT_KEY=testkey \
                    -e MONGO_URI=mongodb://mongo:27017/auth \
                    $IMAGE_NAME:$IMAGE_TAG

                  sleep 10
                  curl -f http://localhost:3001/health || exit 1
                '''
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

                            <div class="section">
                                <strong>Project:</strong> devops-1
                            </div>

                            <div class="section">
                                <strong>Build Number:</strong> ${env.BUILD_NUMBER}
                            </div>

                            <div class="section">
                                <strong>Date:</strong> ${new Date()}
                            </div>

                            <div class="section">
                                <strong>Node Version:</strong> ${nodeVersion}
                            </div>

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
                                <p>✔ Trivy Scan Completed</p>
                                <p>✔ Smoke Test Executed</p>
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
