FROM devops-lab/builder:latest AS builder
FROM node:10.18-alpine3.9
WORKDIR /app
COPY --from=builder /project/src/service-todos/build .
EXPOSE 8080
CMD ["node", "./main.js"]
