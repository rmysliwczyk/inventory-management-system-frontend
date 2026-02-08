pipeline {
    agent any

    environment {
		BACKEND_HOST="https://ims-api.mysliwczykrafal.pl"
    }

    stages {
        stage('Prepare Environment') {
            steps {
                script {
                    sh """
                    rm .env || true
                    echo "VITE_API_URL=${BACKEND_HOST}" >> .env
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t \"ims-frontend\" .'
            }
        }

        stage('Stop and Remove Existing Container') {
            steps {
                sh 'docker stop ims-frontend || true'
                sh 'docker rm ims-frontend || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d --restart always --name \"ims-frontend\" -p 8010:8000 \"ims-frontend\"'
            }
        }
    }
}
