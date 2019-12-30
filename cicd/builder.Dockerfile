FROM node:10.18-alpine3.9
RUN apk add g++ make python
WORKDIR /project
COPY . .
RUN npm ci --production
RUN npx lerna bootstrap --ci -- --production
RUN npm run build
