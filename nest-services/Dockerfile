FROM node:20.11.0

ARG SERVICE
ARG PORT

RUN echo "Service: $SERVICE"
RUN echo "Exposed port: $PORT"

WORKDIR /usr/src/app

COPY /package*.json ./

RUN npm install

COPY . .

RUN npm run build ${SERVICE}

EXPOSE $PORT

CMD ["node", "dist/apps/comic-service/main.js"]
# CMD node dist/apps/${SERVICE}/main.js
# CMD ["sh", "-c", "node dist/apps/$SERVICE/main.js"]
# CMD node dist/apps/${SERVICE}/main.js

# BUILD
#  docker build --build-arg SERVICE=comic-service --build-arg PORT=8001  -t comics-microservices/comics-service:latest .

# EXECUTE
# docker run --rm -p 8001:3001 -e COMICS_PORT=8001 -e KAFKA_BROKER='localhost:9092' -e REDIS_PASS='code' -e REDIS_HOST='localhost' -e REDIS_PORT=6379 -e MONGO_URI='mongodb://micro-user:micro-user@localhost:27017' comics-microservices/comics-service:latest

