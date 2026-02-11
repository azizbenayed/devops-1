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
         
        stage('Dependency Check') {
    steps {
        script {
            def odcHome = tool 'dependency-check'
            sh """
                ${odcHome}/bin/dependency-check.sh \
                --project devops-1 \
                --scan . \
                --format HTML \
                --out dependency-check-report
            """
        }

        publishHTML([
            reportName: 'Dependency Check Report',
            reportDir: 'dependency-check-report',
            reportFiles: 'dependency-check-report.html',
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: false
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
                sh 'trivy image --severity CRITICAL --exit-code 1 $IMAGE_NAME:$IMAGE_TAG'
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

        stage('Generate HTML Report') {
            steps {
                script {
                    def buildStatus = currentBuild.currentResult
                    def nodeVersion = sh(script: "node -v", returnStdout: true).trim()

                    writeFile file: 'report.html', text: """
                    <html>
                    <head>
                        <title>CI Pipeline Report</title>
                        <style>
                            body { font-family: Arial; background: #f4f4f4; padding: 20px; }
                            h1 { color: #333; }
                            .success { color: green; font-weight: bold; }
                            .failure { color: red; font-weight: bold; }
                            .box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px #ccc; }
                        </style>
                    </head>
                    <body>
                        <div class="box">
                            <h1>🚀 CI Pipeline Report</h1>
                            <p><strong>Project:</strong> devops-1</p>
                            <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                            <p><strong>Date:</strong> ${new Date()}</p>
                            <p><strong>Node Version:</strong> ${nodeVersion}</p>
                            <p><strong>Status:</strong> 
                                <span class="${buildStatus == 'SUCCESS' ? 'success' : 'failure'}">
                                    ${buildStatus}
                                </span>
                            </p>
                        </div>
                    </body>
                    </html>
                    """
                }

                publishHTML([
                    reportName: 'CI Report',
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
        success {
            echo '✅ CI PIPELINE SUCCESS'
        }
        failure {
            echo '❌ CI PIPELINE FAILED'
        }
        always {
            echo '🧹 Cleaning test container'
            sh 'docker rm -f $CONTAINER_NAME || true'
        }
    }
}

