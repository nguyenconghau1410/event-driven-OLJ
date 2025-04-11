# Stage 1: Build
FROM node:18.13.0-slim AS build
ARG NODE_ENV
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./ckeditor5-custom-build /app/ckeditor5-custom-build
RUN npm install --production=false
COPY . .
RUN npm run build --configuration=${NODE_ENV}

# Stage 2: Serve
FROM nginx:1.19.8-alpine AS final
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/my-app/browser/ /usr/share/nginx/html/
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]


