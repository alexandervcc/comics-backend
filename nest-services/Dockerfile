FROM node:20.11.0

ARG SERVICE
ARG PORT

RUN echo ">>> ENV VAR: Service: $SERVICE"
RUN echo ">>> ENV VAR: Exposed port: $PORT"

# Pass ARG values to ENV variables
ENV SERVICE=${SERVICE}
ENV PORT=${PORT}

WORKDIR /usr/src/app

COPY /package*.json ./

RUN npm install

COPY . .

RUN npm run build ${SERVICE}

EXPOSE $PORT

CMD ["sh", "-c", "node dist/apps/${SERVICE}/main.js"]

# BUILD
#  docker build --no-cache  --build-arg SERVICE=comic-service --build-arg PORT=8001  -t comics-microservices/comics-service:latest .

# EXECUTE
# docker run --rm --network comics-backend_app-network  -p 8001:3001 -e COMICS_PORT=8001 -e KAFKA_BROKER='kafka:9092' -e REDIS_PASS='code' -e REDIS_HOST='redis' -e REDIS_PORT=6379 -e MONGO_URI='mongodb://micro-user:micro-user@mongo:27017' comics-microservices/comics-service:latest