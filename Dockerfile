FROM node:24
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000
ENTRYPOINT ["npm", "run", "dev"]
