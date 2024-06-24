#빌드
FROM gcr.io/distroless/nodejs18-debian12 AS builder

WORKDIR /app

ADD package.json package-lock.json /app/

RUN npm install

ADD . /app/

RUN npm run build

#실행
FROM gcr.io/distroless/nodejs18-debian12

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package-lock.json /app/

RUN npm install --only=production

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]




# ADD . /app/

# RUN npm install

# RUN npm run build

# EXPOSE 3000

# ENTRYPOINT npm run start:prod