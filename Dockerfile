#빌드
FROM node:20 AS builder
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

#실행
FROM gcr.io/distroless/nodejs20-debian11
COPY --from=builder /app /app
WORKDIR /app
EXPOSE 3000
CMD ["dist/main.js"]

# FROM node:20 AS build-env
# COPY . /app
# WORKDIR /app

# RUN npm ci --omit=dev

# FROM gcr.io/distroless/nodejs20-debian11
# COPY --from=build-env /app /app
# WORKDIR /app
# CMD ["hello.js"]


# ADD . /app/

# RUN npm install

# RUN npm run build

# EXPOSE 3000

# ENTRYPOINT npm run start:prod