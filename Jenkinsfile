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
        TRIVY_DB_REPOSITORY = "ghcr.io/aquasecurity/trivy-db"
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

        stage('Clean Docker Cache') {
            steps {
                sh '''
                docker system prune -af || true
                docker builder prune -af || true
                '''
            }
        }

        stage('Clean Security Cache') {
            steps {
                sh '''
                # NOTE: Trivy's vulnerability DB cache is intentionally kept
                # between builds. Trivy already checks its own DB staleness
                # (NextUpdate metadata) and only re-downloads when needed, so
                # wiping ${TRIVY_CACHE} every run forced a full ~112MB
                # re-download on every build, making the pipeline fragile to
                # network hiccups (see build failures downloading
                # ghcr.io/aquasecurity/trivy-db).
                rm -rf ${ODC_DATA} || true
                '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Vault Only') {
            steps {
                withVault(
                    configuration: [
                        vaultUrl: 'http://localhost:8200',
                        vaultCredentialId: 'vault-token',
                        engineVersion: 2
                    ],
                    vaultSecrets: [[
                        path: 'secret/microservices/auth',
                        engineVersion: 2,
                        secretValues: [
                            [envVar: 'JWT_KEY', vaultKey: 'JWT_KEY'],
                            [envVar: 'MONGO_URI', vaultKey: 'MONGO_URI'],
                            [envVar: 'RABBITMQ_URL', vaultKey: 'RABBITMQ_URL']
                        ]
                    ]]
                ) {
                    sh '''
                    echo "Vault OK"
                    echo "JWT_KEY loaded"
                    echo "MONGO_URI loaded"
                    echo "RABBITMQ_URL loaded"
                    '''
                }
            }
        }

        stage('Check Tools') {
            steps {
                sh '''
                docker --version
                node --version
                npm --version
                trivy --version
                jq --version
                '''
            }
        }

        stage('Prepare Reports') {
            steps {
                sh '''
                mkdir -p trivy-template trivy-reports dependency-check-report

                if [ ! -f trivy-template/html.tpl ]; then
                  curl -L https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl \
                    -o trivy-template/html.tpl
                fi
                '''
            }
        }

        stage('Update Trivy DB') {
            steps {
                sh '''
                trivy image \
                  --download-db-only \
                  --cache-dir ${TRIVY_CACHE} \
                  --db-repository ${TRIVY_DB_REPOSITORY} \
                  --timeout 15m
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
                    withCredentials([
                        string(credentialsId: 'NVD_API_KEY', variable: 'NVD_API_KEY')
                    ]) {
                        sh """
                        ${odcHome}/bin/dependency-check.sh \
                          --project microservices-devops \
                          --scan auth client orders payments tickets expiration image \
                          --format HTML \
                          --format JSON \
                          --out dependency-check-report \
                          --data ${ODC_DATA} \
                          --nvdApiKey \$NVD_API_KEY \
                          --disableRetireJS \
                          --disableNodeAudit
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
                                echo "Building ${service} WITHOUT CACHE..."

                                docker build \
                                  --no-cache \
                                  -t ${IMAGE} \
                                  -t ${IMAGE_LATEST} .

                                docker push ${IMAGE}
                                docker push ${IMAGE_LATEST}

                                trivy image \
                                  --scanners vuln \
                                  --severity HIGH,CRITICAL \
                                  --exit-code 0 \
                                  --cache-dir ${TRIVY_CACHE} \
                                  --timeout 15m \
                                  --format template \
                                  --template "@../trivy-template/html.tpl" \
                                  --output "../trivy-reports/trivy-${service}.html" \
                                  ${IMAGE}

                                trivy image \
                                  --scanners vuln \
                                  --severity HIGH,CRITICAL \
                                  --exit-code 0 \
                                  --cache-dir ${TRIVY_CACHE} \
                                  --timeout 15m \
                                  --format json \
                                  --output "../trivy-reports/trivy-${service}.json" \
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

        stage('AI Security Triage') {
            steps {
                script {
                    try {
                        withVault(
                            configuration: [
                                vaultUrl: 'http://localhost:8200',
                                vaultCredentialId: 'vault-token',
                                engineVersion: 2
                            ],
                            vaultSecrets: [[
                                path: 'secret/jenkins/ai',
                                engineVersion: 2,
                                secretValues: [
                                    [envVar: 'GEMINI_API_KEY', vaultKey: 'GEMINI_API_KEY']
                                ]
                            ]]
                        ) {
                            sh '''
                            # Pull just the HIGH/CRITICAL findings out of the Trivy + OWASP
                            # reports so the prompt we send stays small and cheap. This is
                            # best-effort: if a report is missing/malformed we still produce
                            # a usable (if empty) findings file rather than failing the build.
                            ODC_JSON="dependency-check-report/dependency-check-report.json"
                            FINDINGS="ai-findings.txt"
                            : > "$FINDINGS"

                            if [ -f "$ODC_JSON" ]; then
                              jq -r '
                                [.dependencies[]? | select(.vulnerabilities != null) | .vulnerabilities[]?
                                  | select(.severity == "HIGH" or .severity == "CRITICAL")
                                  | "[OWASP][" + .severity + "] " + .name + " - " + ((.description // "")[0:200])
                                ] | .[0:40][]
                              ' "$ODC_JSON" >> "$FINDINGS" 2>/dev/null || true
                            fi

                            for f in trivy-reports/trivy-*.json; do
                              [ -f "$f" ] || continue
                              SERVICE=$(basename "$f" .json)
                              jq -r --arg svc "$SERVICE" '
                                [.Results[]? | select(.Vulnerabilities != null) | .Vulnerabilities[]?
                                  | "[Trivy][" + $svc + "][" + .Severity + "] " + .VulnerabilityID + " " + .PkgName + " - " + ((.Title // .Description // "")[0:150])
                                ] | .[0:20][]
                              ' "$f" >> "$FINDINGS" 2>/dev/null || true
                            done

                            if [ ! -s "$FINDINGS" ]; then
                              echo "Aucune vulnerabilite HIGH/CRITICAL detectee par Trivy ou OWASP Dependency Check sur ce build." > "$FINDINGS"
                            fi

                            jq -n --arg log "$(cat "$FINDINGS")" '{
                              contents: [{parts: [{text: ("Voici les vulnerabilites HIGH/CRITICAL detectees par Trivy (images Docker) et OWASP Dependency Check (dependances) sur un projet de microservices Node/Express/React. Fais un resume priorise en francais, concis : regroupe par urgence reelle (pas juste par score CVSS brut), explique en une ligne pourquoi chaque groupe compte pour CE projet, puis liste les 3 a 5 actions les plus importantes a faire en premier.\n\n" + $log)}]}],
                              generationConfig: {maxOutputTokens: 1200}
                            }' > ai-security-payload.json

                            curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY" \
                              -H "content-type: application/json" \
                              -d @ai-security-payload.json > ai-security-response.json

                            jq -r 'if .candidates then .candidates[0].content.parts[0].text else "Pas de resume IA disponible : " + (.error.message // "reponse API invalide") end' ai-security-response.json > ai-security-summary.md

                            echo "===== RESUME SECURITE IA ====="
                            cat ai-security-summary.md
                            '''
                        }
                        archiveArtifacts artifacts: 'ai-security-summary.md, ai-findings.txt', allowEmptyArchive: true
                    } catch (err) {
                        echo "AI security triage skipped/failed (non-blocking): ${err}"
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
                    reportFiles: 'trivy-auth.html',
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

            script {
                try {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'jenkins-api-token',
                            usernameVariable: 'JENKINS_USER',
                            passwordVariable: 'JENKINS_TOKEN'
                        )
                    ]) {
                        withVault(
                            configuration: [
                                vaultUrl: 'http://localhost:8200',
                                vaultCredentialId: 'vault-token',
                                engineVersion: 2
                            ],
                            vaultSecrets: [[
                                path: 'secret/jenkins/ai',
                                engineVersion: 2,
                                secretValues: [
                                    [envVar: 'GEMINI_API_KEY', vaultKey: 'GEMINI_API_KEY']
                                ]
                            ]]
                        ) {
                            sh '''
                            # Grab the tail of this build's own console log via the Jenkins
                            # REST API (works regardless of which stage failed) and ask the
                            # AI to diagnose the root cause. Best-effort: never fails the
                            # build further if this step itself has a problem.
                            curl -s -u "$JENKINS_USER:$JENKINS_TOKEN" "${BUILD_URL}consoleText" -o console-full.log || echo "" > console-full.log
                            tail -c 15000 console-full.log > console-tail.log

                            jq -n --arg log "$(cat console-tail.log)" --arg build "${BUILD_NUMBER}" '{
                              model: "claude-sonnet-5",
                              max_tokens: 800,
                              messages: [{role: "user", content: ("Voici la fin des logs du pipeline Jenkins DevSecOps #" + $build + " qui vient d echouer. Identifie la cause probable de l echec (quelle etape, quelle erreur exacte) et propose un correctif concret et concis, en francais:\n\n" + $log)}]
                            }' > ai-failure-payload.json

                            curl -s https://api.anthropic.com/v1/messages \
                              -H "x-api-key: $ANTHROPIC_API_KEY" \
                              -H "anthropic-version: 2023-06-01" \
                              -H "content-type: application/json" \
                              -d @ai-failure-payload.json > ai-failure-response.json

                            jq -r '.content[0].text // "Pas de diagnostic IA disponible (reponse API invalide)."' ai-failure-response.json > ai-diagnosis.txt

                            echo "===== DIAGNOSTIC IA DE L ECHEC ====="
                            cat ai-diagnosis.txt
                            '''
                        }
                    }
                    archiveArtifacts artifacts: 'ai-diagnosis.txt', allowEmptyArchive: true
                } catch (err) {
                    echo "AI failure diagnosis skipped/failed (non-blocking): ${err}"
                }
            }
        }
    }
}
