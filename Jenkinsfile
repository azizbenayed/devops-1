Started by user aziz-dev
Obtained Jenkinsfile from git https://github.com/azizbenayed/devops-1.git
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/lib/jenkins/workspace/devops-1-ci
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Declarative: Checkout SCM)
[Pipeline] checkout
Selected Git installation does not exist. Using Default
The recommended git tool is: NONE
No credentials specified
 > git rev-parse --resolve-git-dir /var/lib/jenkins/workspace/devops-1-ci/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/azizbenayed/devops-1.git # timeout=10
Fetching upstream changes from https://github.com/azizbenayed/devops-1.git
 > git --version # timeout=10
 > git --version # 'git version 2.34.1'
 > git fetch --tags --force --progress -- https://github.com/azizbenayed/devops-1.git +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/master^{commit} # timeout=10
Checking out Revision b457a7b86f4001f34c8e0ac854b16dc6fafd3fc1 (refs/remotes/origin/master)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f b457a7b86f4001f34c8e0ac854b16dc6fafd3fc1 # timeout=10
Commit message: "Update IMAGE_TAG to use dynamic TAG format"
 > git rev-list --no-walk 58948b674c93b9adc11ac49a7adba2beb55e43e4 # timeout=10
[Pipeline] }
[Pipeline] // stage
[Pipeline] withEnv
[Pipeline] {
[Pipeline] withEnv
[Pipeline] {
[Pipeline] timestamps
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Declarative: Tool Install)
[Pipeline] tool
[Pipeline] envVarsForTool
[Pipeline] }
[Pipeline] // stage
[Pipeline] withEnv
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Build All Microservices)
[Pipeline] tool
[Pipeline] envVarsForTool
[Pipeline] withEnv
[Pipeline] {
[Pipeline] script
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Install auth)
[Pipeline] dir
[2026-02-23T11:04:36.491Z] Running in /var/lib/jenkins/workspace/devops-1-ci/auth
[Pipeline] {
[Pipeline] echo
[2026-02-23T11:04:36.568Z] 📦 Installing dependencies for auth
[Pipeline] sh
[2026-02-23T11:04:36.885Z] + npm install
[2026-02-23T11:04:49.005Z] 
[2026-02-23T11:04:49.005Z] up to date, audited 505 packages in 10s
[2026-02-23T11:04:49.005Z] 
[2026-02-23T11:04:49.006Z] 54 packages are looking for funding
[2026-02-23T11:04:49.006Z]   run `npm fund` for details
[2026-02-23T11:04:49.006Z] 
[2026-02-23T11:04:49.006Z] 41 vulnerabilities (4 low, 4 moderate, 31 high, 2 critical)
[2026-02-23T11:04:49.006Z] 
[2026-02-23T11:04:49.006Z] To address issues that do not require attention, run:
[2026-02-23T11:04:49.006Z]   npm audit fix
[2026-02-23T11:04:49.006Z] 
[2026-02-23T11:04:49.006Z] To address all issues possible (including breaking changes), run:
[2026-02-23T11:04:49.006Z]   npm audit fix --force
[2026-02-23T11:04:49.006Z] 
[2026-02-23T11:04:49.006Z] Some issues need review, and may require choosing
[2026-02-23T11:04:49.007Z] a different dependency.
[2026-02-23T11:04:49.009Z] 
[2026-02-23T11:04:49.009Z] Run `npm audit` for details.
[Pipeline] }
[Pipeline] // dir
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (SonarQube auth)
[Pipeline] dir
[2026-02-23T11:04:49.308Z] Running in /var/lib/jenkins/workspace/devops-1-ci/auth
[Pipeline] {
[Pipeline] tool
[Pipeline] withSonarQubeEnv
[2026-02-23T11:04:49.440Z] Injecting SonarQube environment variables using the configuration: sonarqube
[Pipeline] {
[Pipeline] sh
[2026-02-23T11:04:49.786Z] + /var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar-scanner/bin/sonar-scanner -Dsonar.projectKey=auth -Dsonar.projectName=auth -Dsonar.sources=.
[2026-02-23T11:04:51.133Z] 12:04:50.936 INFO  Scanner configuration file: /var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar-scanner/conf/sonar-scanner.properties
[2026-02-23T11:04:51.133Z] 12:04:50.961 INFO  Project root configuration file: NONE
[2026-02-23T11:04:51.133Z] 12:04:51.011 INFO  SonarScanner CLI 8.0.1.6346
[2026-02-23T11:04:51.133Z] 12:04:51.018 INFO  Linux 6.8.0-94-generic amd64
[2026-02-23T11:04:56.357Z] 12:04:55.597 INFO  Communicating with SonarQube Server 9.9.8.100196
[2026-02-23T11:04:57.706Z] 12:04:57.594 INFO  Load global settings
[2026-02-23T11:04:57.964Z] 12:04:57.912 INFO  Load global settings (done) | time=321ms
[2026-02-23T11:04:57.964Z] 12:04:57.927 INFO  Server id: 147B411E-AZxJ0hV1_YHu6vGk8JNd
[2026-02-23T11:04:58.221Z] 12:04:58.005 INFO  User cache: /var/lib/jenkins/.sonar/cache
[2026-02-23T11:04:58.221Z] 12:04:58.030 INFO  Load/download plugins
[2026-02-23T11:04:58.221Z] 12:04:58.036 INFO  Load plugins index
[2026-02-23T11:04:58.221Z] 12:04:58.205 INFO  Load plugins index (done) | time=175ms
[2026-02-23T11:04:58.774Z] 12:04:58.522 INFO  Load/download plugins (done) | time=493ms
[2026-02-23T11:05:00.641Z] 12:05:00.386 INFO  Process project properties
[2026-02-23T11:05:00.642Z] 12:05:00.432 INFO  Process project properties (done) | time=46ms
[2026-02-23T11:05:00.642Z] 12:05:00.442 INFO  Execute project builders
[2026-02-23T11:05:00.642Z] 12:05:00.448 INFO  Execute project builders (done) | time=6ms
[2026-02-23T11:05:00.642Z] 12:05:00.456 INFO  Project key: auth
[2026-02-23T11:05:00.642Z] 12:05:00.457 INFO  Base dir: /var/lib/jenkins/workspace/devops-1-ci/auth
[2026-02-23T11:05:00.642Z] 12:05:00.457 INFO  Working dir: /var/lib/jenkins/workspace/devops-1-ci/auth/.scannerwork
[2026-02-23T11:05:00.642Z] 12:05:00.510 INFO  Load project settings for component key: 'auth'
[2026-02-23T11:05:01.196Z] 12:05:01.065 INFO  Auto-configuring with CI 'Jenkins'
[2026-02-23T11:05:01.196Z] 12:05:01.076 INFO  Load quality profiles
[2026-02-23T11:05:01.751Z] 12:05:01.709 INFO  Load quality profiles (done) | time=633ms
[2026-02-23T11:05:01.751Z] 12:05:01.740 INFO  Load active rules
[2026-02-23T11:05:11.646Z] 12:05:11.252 INFO  Load active rules (done) | time=9512ms
[2026-02-23T11:05:11.646Z] 12:05:11.267 INFO  Load analysis cache
[2026-02-23T11:05:11.647Z] 12:05:11.284 INFO  Load analysis cache (404) | time=17ms
[2026-02-23T11:05:11.647Z] 12:05:11.478 INFO  Load project repositories
[2026-02-23T11:05:11.647Z] 12:05:11.495 INFO  Load project repositories (done) | time=17ms
[2026-02-23T11:05:11.898Z] 12:05:11.743 INFO  Indexing files...
[2026-02-23T11:05:11.898Z] 12:05:11.747 INFO  Project configuration:
[2026-02-23T11:05:17.103Z] 12:05:16.300 INFO  18 files indexed
[2026-02-23T11:05:17.103Z] 12:05:16.301 INFO  8423 files ignored because of scm ignore settings
[2026-02-23T11:05:17.104Z] 12:05:16.304 INFO  Quality profile for json: Sonar way
[2026-02-23T11:05:17.104Z] 12:05:16.305 INFO  Quality profile for ts: Sonar way
[2026-02-23T11:05:17.104Z] 12:05:16.305 INFO  ------------- Run sensors on module auth
[2026-02-23T11:05:17.104Z] 12:05:16.696 INFO  Load metrics repository
[2026-02-23T11:05:17.104Z] 12:05:16.778 INFO  Load metrics repository (done) | time=82ms
[2026-02-23T11:05:22.306Z] 12:05:21.956 INFO  Sensor JaCoCo XML Report Importer [jacoco]
[2026-02-23T11:05:22.307Z] 12:05:21.959 INFO  'sonar.coverage.jacoco.xmlReportPaths' is not defined. Using default locations: target/site/jacoco/jacoco.xml,target/site/jacoco-it/jacoco.xml,build/reports/jacoco/test/jacocoTestReport.xml
[2026-02-23T11:05:22.307Z] 12:05:21.961 INFO  No report imported, no coverage information will be imported by JaCoCo XML Report Importer
[2026-02-23T11:05:22.307Z] 12:05:21.962 INFO  Sensor JaCoCo XML Report Importer [jacoco] (done) | time=7ms
[2026-02-23T11:05:22.307Z] 12:05:21.963 INFO  Sensor IaC CloudFormation Sensor [iac]
[2026-02-23T11:05:22.307Z] 12:05:22.202 INFO  0 source files to be analyzed
[2026-02-23T11:05:22.307Z] 12:05:22.280 INFO  0/0 source files have been analyzed
[2026-02-23T11:05:22.307Z] 12:05:22.281 INFO  Sensor IaC CloudFormation Sensor [iac] (done) | time=317ms
[2026-02-23T11:05:22.307Z] 12:05:22.283 INFO  Sensor IaC Kubernetes Sensor [iac]
[2026-02-23T11:05:22.562Z] 12:05:22.416 INFO  0 source files to be analyzed
[2026-02-23T11:05:22.562Z] 12:05:22.521 INFO  0/0 source files have been analyzed
[2026-02-23T11:05:22.562Z] 12:05:22.523 INFO  Sensor IaC Kubernetes Sensor [iac] (done) | time=241ms
[2026-02-23T11:05:22.562Z] 12:05:22.523 INFO  Sensor TypeScript analysis [javascript]
[2026-02-23T11:05:40.542Z] 12:05:38.980 WARN  Node.js version 20 is not recommended, you might experience issues. Please use a recommended version of Node.js [16, 18]
[2026-02-23T11:05:40.543Z] 12:05:39.132 INFO  Found 1 tsconfig.json file(s): [/var/lib/jenkins/workspace/devops-1-ci/auth/tsconfig.json]
[2026-02-23T11:05:40.543Z] 12:05:39.134 INFO  Creating TypeScript program
[2026-02-23T11:05:40.543Z] 12:05:39.134 INFO  TypeScript configuration file /var/lib/jenkins/workspace/devops-1-ci/auth/tsconfig.json
[2026-02-23T11:05:40.543Z] 12:05:39.143 INFO  15 source files to be analyzed
[2026-02-23T11:05:43.782Z] 12:05:43.270 INFO  Creating TypeScript program (done) | time=4135ms
[2026-02-23T11:05:43.782Z] 12:05:43.270 INFO  Starting analysis with current program
[2026-02-23T11:05:50.279Z] 12:05:49.166 INFO  4/15 files analyzed, current file: /var/lib/jenkins/workspace/devops-1-ci/auth/src/models/user.ts
[2026-02-23T11:05:58.323Z] 12:05:57.203 INFO  Analyzed 15 file(s) with current program
[2026-02-23T11:05:58.323Z] 12:05:57.213 INFO  15/15 source files have been analyzed
[2026-02-23T11:05:58.323Z] 12:05:57.214 INFO  Hit the cache for 0 out of 15
[2026-02-23T11:05:58.323Z] 12:05:57.221 INFO  Miss the cache for 15 out of 15: ANALYSIS_MODE_INELIGIBLE [15/15]
[2026-02-23T11:05:58.323Z] 12:05:57.224 INFO  Sensor TypeScript analysis [javascript] (done) | time=34701ms
[2026-02-23T11:05:58.323Z] 12:05:57.224 INFO  Sensor CSS Rules [javascript]
[2026-02-23T11:05:58.323Z] 12:05:57.225 INFO  No CSS, PHP, HTML or VueJS files are found in the project. CSS analysis is skipped.
[2026-02-23T11:05:58.323Z] 12:05:57.225 INFO  Sensor CSS Rules [javascript] (done) | time=1ms
[2026-02-23T11:05:58.323Z] 12:05:57.225 INFO  Sensor C# Project Type Information [csharp]
[2026-02-23T11:05:58.323Z] 12:05:57.226 INFO  Sensor C# Project Type Information [csharp] (done) | time=1ms
[2026-02-23T11:05:58.323Z] 12:05:57.227 INFO  Sensor C# Analysis Log [csharp]
[2026-02-23T11:05:58.323Z] 12:05:57.288 INFO  Sensor C# Analysis Log [csharp] (done) | time=61ms
[2026-02-23T11:05:58.323Z] 12:05:57.289 INFO  Sensor C# Properties [csharp]
[2026-02-23T11:05:58.323Z] 12:05:57.290 INFO  Sensor C# Properties [csharp] (done) | time=0ms
[2026-02-23T11:05:58.323Z] 12:05:57.290 INFO  Sensor HTML [web]
[2026-02-23T11:05:58.323Z] 12:05:57.297 INFO  Sensor HTML [web] (done) | time=7ms
[2026-02-23T11:05:58.323Z] 12:05:57.298 INFO  Sensor TextAndSecretsSensor [text]
[2026-02-23T11:05:58.323Z] 12:05:57.317 INFO  18 source files to be analyzed
[2026-02-23T11:05:58.323Z] 12:05:58.024 INFO  18/18 source files have been analyzed
[2026-02-23T11:05:58.323Z] 12:05:58.025 INFO  Sensor TextAndSecretsSensor [text] (done) | time=727ms
[2026-02-23T11:05:58.323Z] 12:05:58.025 INFO  Sensor VB.NET Project Type Information [vbnet]
[2026-02-23T11:05:58.323Z] 12:05:58.027 INFO  Sensor VB.NET Project Type Information [vbnet] (done) | time=2ms
[2026-02-23T11:05:58.326Z] 12:05:58.028 INFO  Sensor VB.NET Analysis Log [vbnet]
[2026-02-23T11:05:58.326Z] 12:05:58.097 INFO  Sensor VB.NET Analysis Log [vbnet] (done) | time=69ms
[2026-02-23T11:05:58.326Z] 12:05:58.097 INFO  Sensor VB.NET Properties [vbnet]
[2026-02-23T11:05:58.326Z] 12:05:58.098 INFO  Sensor VB.NET Properties [vbnet] (done) | time=1ms
[2026-02-23T11:05:58.326Z] 12:05:58.098 INFO  Sensor IaC Docker Sensor [iac]
[2026-02-23T11:05:58.326Z] 12:05:58.101 INFO  0 source files to be analyzed
[2026-02-23T11:05:58.326Z] 12:05:58.253 INFO  0/0 source files have been analyzed
[2026-02-23T11:05:58.326Z] 12:05:58.253 INFO  Sensor IaC Docker Sensor [iac] (done) | time=155ms
[2026-02-23T11:05:58.326Z] 12:05:58.265 INFO  ------------- Run sensors on project
[2026-02-23T11:05:58.581Z] 12:05:58.421 INFO  Sensor Analysis Warnings import [csharp]
[2026-02-23T11:05:58.581Z] 12:05:58.423 INFO  Sensor Analysis Warnings import [csharp] (done) | time=2ms
[2026-02-23T11:05:58.581Z] 12:05:58.424 INFO  Sensor Zero Coverage Sensor
[2026-02-23T11:05:58.581Z] 12:05:58.456 INFO  Sensor Zero Coverage Sensor (done) | time=32ms
[2026-02-23T11:05:58.582Z] 12:05:58.461 INFO  SCM Publisher SCM provider for this project is: git
[2026-02-23T11:05:58.582Z] 12:05:58.464 INFO  SCM Publisher 15 source files to be analyzed
[2026-02-23T11:05:59.140Z] 12:05:58.861 INFO  SCM Publisher 15/15 source files have been analyzed (done) | time=395ms
[2026-02-23T11:05:59.140Z] 12:05:58.898 INFO  CPD Executor 3 files had no CPD blocks
[2026-02-23T11:05:59.140Z] 12:05:58.900 INFO  CPD Executor Calculating CPD for 12 files
[2026-02-23T11:05:59.140Z] 12:05:58.969 INFO  CPD Executor CPD calculation finished (done) | time=66ms
[2026-02-23T11:05:59.393Z] 12:05:59.226 INFO  Analysis report generated in 236ms, dir size=166.6 kB
[2026-02-23T11:05:59.393Z] 12:05:59.382 INFO  Analysis report compressed in 155ms, zip size=58.8 kB
[2026-02-23T11:06:00.740Z] 12:06:00.671 INFO  Analysis report uploaded in 1288ms
[2026-02-23T11:06:00.740Z] 12:06:00.680 INFO  ANALYSIS SUCCESSFUL, you can find the results at: http://localhost:9000/dashboard?id=auth
[2026-02-23T11:06:00.740Z] 12:06:00.680 INFO  Note that you will be able to access the updated dashboard once the server has processed the submitted analysis report
[2026-02-23T11:06:00.740Z] 12:06:00.680 INFO  More about the report processing at http://localhost:9000/api/ce/task?id=AZyKLXQk06pygAcqFLMh
[2026-02-23T11:06:03.232Z] 12:06:03.120 INFO  Analysis total time: 1:04.294 s
[2026-02-23T11:06:03.232Z] 12:06:03.129 INFO  EXECUTION SUCCESS
[2026-02-23T11:06:03.232Z] 12:06:03.133 INFO  Total time: 1:12.324s
[Pipeline] }
[Pipeline] // withSonarQubeEnv
[Pipeline] }
[Pipeline] // dir
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (OWASP auth)
[Pipeline] dir
[2026-02-23T11:06:05.620Z] Running in /var/lib/jenkins/workspace/devops-1-ci/auth
[Pipeline] {
[Pipeline] tool
[Pipeline] sh
[2026-02-23T11:06:06.244Z] + /var/lib/jenkins/tools/org.jenkinsci.plugins.DependencyCheck.tools.DependencyCheckInstallation/dependency-check/bin/dependency-check.sh --project auth --scan . --format HTML --out dependency-check-report
[2026-02-23T11:06:37.727Z] [INFO] Checking for updates
[2026-02-23T11:06:37.727Z] [WARN] An NVD API Key was not provided - it is highly recommended to use an NVD API key as the update can take a VERY long time without an API Key
[2026-02-23T11:07:04.162Z] [INFO] NVD API has 2,321 records in this update
[2026-02-23T11:07:06.663Z] [INFO] Downloaded 2,321/2,321 (100%)
[2026-02-23T11:07:16.586Z] [INFO] Completed processing batch 1/2 (50%) in 13,336ms
[2026-02-23T11:07:16.586Z] [INFO] Completed processing batch 2/2 (100%) in 734ms
[2026-02-23T11:07:17.931Z] [INFO] Updating CISA Known Exploited Vulnerability list: https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json
[2026-02-23T11:07:20.419Z] [INFO] Begin database defrag
[2026-02-23T11:07:52.371Z] [INFO] End database defrag (27514 ms)
[2026-02-23T11:07:52.371Z] [INFO] Check for updates complete (78683 ms)
[2026-02-23T11:07:52.371Z] [INFO] 
[2026-02-23T11:07:52.371Z] 
[2026-02-23T11:07:52.371Z] Dependency-Check is an open source tool performing a best effort analysis of 3rd party dependencies; false positives and false negatives may exist in the analysis performed by the tool. Use of the tool and the reporting provided constitutes acceptance for use in an AS IS condition, and there are NO warranties, implied or otherwise, with regard to the analysis or its use. Any use of the tool and the reporting provided is at the user's risk. In no event shall the copyright holder or OWASP be held liable for any damages whatsoever arising out of or in connection with the use of this tool, the analysis performed, or the resulting report.
[2026-02-23T11:07:52.371Z] 
[2026-02-23T11:07:52.371Z] 
[2026-02-23T11:07:52.371Z]    About ODC: https://dependency-check.github.io/DependencyCheck/general/internals.html
[2026-02-23T11:07:52.371Z]    False Positives: https://dependency-check.github.io/DependencyCheck/general/suppression.html
[2026-02-23T11:07:52.372Z] 
[2026-02-23T11:07:52.372Z] 
[2026-02-23T11:07:52.372Z] [INFO] Analysis Started
[2026-02-23T11:07:52.372Z] [INFO] Finished File Name Analyzer (0 seconds)
[2026-02-23T11:07:52.372Z] [WARN] dependency skipped: node module fsevents seems optional and not installed
[2026-02-23T11:07:53.719Z] [INFO] Finished Node.js Package Analyzer (5 seconds)
[2026-02-23T11:07:54.634Z] [INFO] Finished Dependency Merging Analyzer (0 seconds)
[2026-02-23T11:07:55.190Z] [INFO] Finished Hint Analyzer (0 seconds)
[2026-02-23T11:07:55.190Z] [INFO] Finished Version Filter Analyzer (0 seconds)
[2026-02-23T11:08:03.225Z] [INFO] Created CPE Index (8 seconds)
[2026-02-23T11:08:15.350Z] [INFO] Finished CPE Analyzer (18 seconds)
[2026-02-23T11:08:15.351Z] [INFO] Finished False Positive Analyzer (0 seconds)
[2026-02-23T11:08:15.351Z] [INFO] Finished NVD CVE Analyzer (0 seconds)
[2026-02-23T11:08:15.602Z] [INFO] Finished Node Audit Analyzer (2 seconds)
[2026-02-23T11:08:16.515Z] [INFO] Finished Yarn Audit Analyzer (0 seconds)
[2026-02-23T11:13:22.851Z] [INFO] Finished RetireJS Analyzer (295 seconds)
[2026-02-23T11:13:22.852Z] [WARN] Disabling OSS Index analyzer due to missing user/password credentials. Authentication is now required: https://ossindex.sonatype.org/doc/auth-required
[2026-02-23T11:13:22.852Z] [INFO] Finished Vulnerability Suppression Analyzer (0 seconds)
[2026-02-23T11:13:22.852Z] [INFO] Finished Known Exploited Vulnerability Analyzer (0 seconds)
[2026-02-23T11:13:22.852Z] [INFO] Finished Dependency Bundling Analyzer (10 seconds)
[2026-02-23T11:13:22.852Z] [INFO] Finished Unused Suppression Rule Analyzer (0 seconds)
[2026-02-23T11:13:22.852Z] [INFO] Analysis Complete (334 seconds)
[2026-02-23T11:13:23.105Z] [INFO] Writing HTML report to: /var/lib/jenkins/workspace/devops-1-ci/auth/dependency-check-report/dependency-check-report.html
[Pipeline] }
[Pipeline] // dir
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Docker Build auth)
[Pipeline] dir
[2026-02-23T11:13:26.578Z] Running in /var/lib/jenkins/workspace/devops-1-ci/auth
[Pipeline] {
[Pipeline] }
[Pipeline] // dir
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Declarative: Post Actions)
[Pipeline] echo
[2026-02-23T11:13:27.448Z] ❌ PIPELINE FAILED
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // timestamps
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Also:   org.jenkinsci.plugins.workflow.actions.ErrorAction$ErrorId: 64c9c881-95b2-4727-b434-eca49ee1d175
groovy.lang.MissingPropertyException: No such property: IMAGE_TAG for class: groovy.lang.Binding
	at groovy.lang.Binding.getVariable(Binding.java:63)
	at PluginClassLoader for script-security//org.jenkinsci.plugins.scriptsecurity.sandbox.groovy.SandboxInterceptor.onGetProperty(SandboxInterceptor.java:285)
	at PluginClassLoader for script-security//org.kohsuke.groovy.sandbox.impl.Checker$7.call(Checker.java:375)
	at PluginClassLoader for script-security//org.kohsuke.groovy.sandbox.impl.Checker.checkedGetProperty(Checker.java:379)
	at PluginClassLoader for script-security//org.kohsuke.groovy.sandbox.impl.Checker.checkedGetProperty(Checker.java:355)
	at PluginClassLoader for script-security//org.kohsuke.groovy.sandbox.impl.Checker.checkedGetProperty(Checker.java:355)
	at PluginClassLoader for script-security//org.kohsuke.groovy.sandbox.impl.Checker.checkedGetProperty(Checker.java:355)
	at PluginClassLoader for script-security//org.kohsuke.groovy.sandbox.impl.Checker.checkedGetProperty(Checker.java:355)
	at PluginClassLoader for script-security//org.kohsuke.groovy.sandbox.impl.Checker.checkedGetProperty(Checker.java:355)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.sandbox.SandboxInvoker.getProperty(SandboxInvoker.java:29)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.LoggingInvoker.getProperty(LoggingInvoker.java:139)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.impl.PropertyAccessBlock.rawGet(PropertyAccessBlock.java:20)
	at WorkflowScript.run(WorkflowScript:70)
	at ___cps.transform___(Native Method)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.impl.PropertyishBlock$ContinuationImpl.get(PropertyishBlock.java:74)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.LValueBlock$GetAdapter.receive(LValueBlock.java:30)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.impl.PropertyishBlock$ContinuationImpl.fixName(PropertyishBlock.java:66)
	at jdk.internal.reflect.GeneratedMethodAccessor428.invoke(Unknown Source)
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.base/java.lang.reflect.Method.invoke(Method.java:569)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.impl.ContinuationPtr$ContinuationImpl.receive(ContinuationPtr.java:71)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.impl.ConstantBlock.eval(ConstantBlock.java:21)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.Next.step(Next.java:84)
	at PluginClassLoader for workflow-cps//com.cloudbees.groovy.cps.Continuable.run0(Continuable.java:142)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.SandboxContinuable.access$001(SandboxContinuable.java:17)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.SandboxContinuable.run0(SandboxContinuable.java:48)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.CpsThread.runNextChunk(CpsThread.java:188)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.CpsThreadGroup.run(CpsThreadGroup.java:464)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.CpsThreadGroup$2.call(CpsThreadGroup.java:372)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.CpsThreadGroup$2.call(CpsThreadGroup.java:302)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.CpsVmExecutorService.lambda$wrap$4(CpsVmExecutorService.java:143)
	at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
	at hudson.remoting.SingleLaneExecutorService$1.run(SingleLaneExecutorService.java:139)
	at jenkins.util.ContextResettingExecutorService$1.run(ContextResettingExecutorService.java:28)
	at jenkins.security.ImpersonatingExecutorService$1.run(ImpersonatingExecutorService.java:68)
	at jenkins.util.ErrorLoggingExecutorService.lambda$wrap$0(ErrorLoggingExecutorService.java:51)
	at java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:539)
	at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.CpsVmExecutorService$1.call(CpsVmExecutorService.java:53)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.CpsVmExecutorService$1.call(CpsVmExecutorService.java:50)
	at org.codehaus.groovy.runtime.GroovyCategorySupport$ThreadCategoryInfo.use(GroovyCategorySupport.java:136)
	at org.codehaus.groovy.runtime.GroovyCategorySupport.use(GroovyCategorySupport.java:275)
	at PluginClassLoader for workflow-cps//org.jenkinsci.plugins.workflow.cps.CpsVmExecutorService.lambda$categoryThreadFactory$0(CpsVmExecutorService.java:50)
	at java.base/java.lang.Thread.run(Thread.java:840)
Finished: FAILURE
pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    options {
        timestamps()
    }

    stages {

        stage('Build All Microservices') {
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

                        stage("Install ${service}") {
                            dir(service) {
                                echo "📦 Installing dependencies for ${service}"
                                sh "npm install"
                            }
                        }

                        stage("SonarQube ${service}") {
                            dir(service) {
                                def scannerHome = tool 'sonar-scanner'
                                withSonarQubeEnv('sonarqube') {
                                    sh """
                                        ${scannerHome}/bin/sonar-scanner \
                                        -Dsonar.projectKey=${service} \
                                        -Dsonar.projectName=${service} \
                                        -Dsonar.sources=.
                                    """
                                }
                            }
                        }

                        stage("OWASP ${service}") {
                            dir(service) {
                                def odcHome = tool 'dependency-check'
                                sh """
                                    ${odcHome}/bin/dependency-check.sh \
                                    --project ${service} \
                                    --scan . \
                                    --format HTML \
                                    --out dependency-check-report
                                """
                            }
                        }

                        stage("Docker Build ${service}") {
                            dir(service) {
                                sh "docker build -t ${service}:${TAG} ."
                            }
                        }

                        stage("Trivy Scan ${service}") {
                            sh """
                                trivy image \
                                --scanners vuln \
                                ${service}:${IMAGE_TAG}
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ ALL MICROSERVICES BUILT SUCCESSFULLY"
        }
        failure {
            echo "❌ PIPELINE FAILED"
        }
    }
}
