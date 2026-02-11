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

        stage('Checkout Source Code') {
            steps {
                echo '📥 Cloning repository from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/azizbenayed/devops-1.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('sonarqube') {
            sh 'sonar-scanner'
        }
    }
}

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh '''
                  docker build -t $IMAGE_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                echo '🔐 Scanning Docker image with Trivy...'
                sh '''
                  trivy image --severity CRITICAL --exit-code 1 $IMAGE_NAME:$IMAGE_TAG
                '''
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
                  curl -f http://localhost:3001/health
                '''
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
