pipeline {
    agent any

    stages {
        stage('Test Vault Only') {
            steps {
                withVault([
                    vaultSecrets: [[
                        path: 'secret/data/microservices/auth',
                        engineVersion: 2,
                        secretValues: [
                            [envVar: 'JWT_KEY', vaultKey: 'JWT_KEY'],
                            [envVar: 'MONGO_URI', vaultKey: 'MONGO_URI'],
                            [envVar: 'RABBITMQ_URL', vaultKey: 'RABBITMQ_URL']
                        ]
                    ]]
                ]) {
                    sh '''
                    echo "Vault OK"
                    echo "JWT_KEY loaded"
                    echo "MONGO_URI loaded"
                    echo "RABBITMQ_URL loaded"
                    '''
                }
            }
        }
    }
}
