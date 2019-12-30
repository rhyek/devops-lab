FROM devops-lab/builder:latest AS builder
FROM node:10.18-alpine3.9
WORKDIR /app
COPY --from=builder /project/src/app-web/build .
EXPOSE 8080
RUN npm i -g serve
CMD ["serve", "-s", ".", "-l", "8080"]
