FROM node:12-alpine as build-step
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run ng build 

FROM nginx:1.17-alpine as prod-stage
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-step /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
