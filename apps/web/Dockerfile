FROM node:10.18-alpine3.9
WORKDIR /app
COPY ./build .
EXPOSE 8080
RUN npm i -g serve
CMD ["serve", "-s", ".", "-l", "8080"]
