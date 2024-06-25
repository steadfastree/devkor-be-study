#빌드 단계
FROM node:20-alpine AS builder
WORKDIR /app
ADD package.json package-lock.json /app/
RUN npm install
ADD . /app/
RUN npm run build

#실행 단계
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package-lock.json /app/
RUN npm install --only=production
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start:prod"]
