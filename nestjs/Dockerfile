FROM node:latest
WORKDIR /app
# COPY . .
RUN apt-get update && apt-get install -y build-essential python3
RUN npm cache clean --force && npm install -g @nestjs/cli
# RUN npm link webpack
RUN nest new -g -p npm osman
WORKDIR /app/osman
COPY ./package.json .
COPY ./src ./src
RUN npm install
RUN npm run build
ENTRYPOINT [ "npm", "run", "start" ]