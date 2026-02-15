# Inventory Management System - Frontend

React Frontend for Inventory Management System. Check out the API [here](https://github.com/rmysliwczyk/inventory-management-system-backend)

## 🌟 Highlights

- 🏷️ Generating asset tags (labels) in PDF, ready for printing
- ⛶ Qr Code scanner for scanning asset tags
- 📦 Quick and intuitive system for taking stock of assets
- 🌙 Dark mode with system preference awareness
- 🛂 Authorization with Admin and User actions separation
- 📱Responsive design for mobile and desktop
- 🔐 Session management with Secure JWT Tokens
- ✨ Clean and simple

## 💻 Technologies used

- <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/TypeScript.svg" width=24/> **Typescript** for the programming language
- <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/React-Light.svg" width=24/> **React** for the UI framework
- <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/MaterialUI-Light.svg" width=24/> **MaterialUI** for the React component library
- <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/Vite-Light.svg" width=24/> **Vite** for the build system
- <img src="https://reactrouter.com/_brand/React%20Router%20Brand%20Assets/React%20Router%20Logo/Light.svg" width=24/> **React Router** for the page routing
- 📋 **React Hook Forms** for the form validation
- ⛶ [**@yudiel/react-qr-scanner**](https://github.com/yudielcurbelo/react-qr-scanner) for the Qr scanner
- <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/Jenkins-Light.svg" width=24/> **Jenkins** for CI/CD
- <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/Docker.svg" width=24/> **Docker** for CI/CD
- <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/GithubActions-Light.svg" width=24/> **GitHub Actions** for CI/CD (🕐 Coming soon...)

## 👉 Try it!

Self hosted here: [ims-api.mysliwczykrafal.pl](https://ims.mysliwczykrafal.pl)  
|Account type|Login|Password|
|------------|-----|--------|
|Admin |admin| admin |
|Regular user|user |user |

## 📥 Deployment

If you wish to deploy the app yourself follow these steps:

- Install [Docker](https://docs.docker.com/engine/install/) or [Podman](https://podman.io/docs/installation). If you use Podman, replace `docker` command with `podman` in the following steps.
- `git clone` the repository or download and extract the .zip with the source code.
- `cd /directory/with/the/sourcecode`
- `mv .env.example .env`
- Make sure to edit the default variables values in .env
- `docker build -t "ims-frontend" .`
- `docker run -d --rm --name "ims-frontend" -p 8000:8000 "ims-frontend"`
- Visit `http://127.0.0.1/login` to access the login page

## 📝 Project details

Description of work organization and demo deployment details

No AI was used for the code of documentation of this project. I'm not opposed to using AI tools in the right context, but for the purpose of my personal portfolio projects I've decided not to use them.

### Tools and resources

#### Project management

- <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/refs/heads/main/assets/git-auto.svg" width=24/> **Git** for version control
- <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/refs/heads/main/assets/uml-auto.svg" width=24/> **UML** for Use case, Activity, and Class diagrams
- <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/refs/heads/main/assets/jira-auto.svg" width=24/> **Jira** for tracking tasks and bugs

#### Deployment

- <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/refs/heads/main/assets/linux-auto.svg" width=24/> Local homelab server running **Debian Linux**
- 🌎 **Dynamic DNS** with [Dynu](https://www.dynu.com) for hosting with dynamic IP
- <img src="https://github.com/LelouchFR/skill-icons/blob/main/assets/nginx.svg" width=24/> **NGINX** for reverse proxy
- <img src="https://raw.githubusercontent.com/LelouchFR/skill-icons/refs/heads/main/assets/github-auto.svg" width=24/> **GitHub webhook** for triggering Jenkins build and deployment
- 🌐 **HTTPS** with certbot and Let's Encrypt
