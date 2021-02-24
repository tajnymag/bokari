FROM nginx:alpine
WORKDIR /etc/nginx
RUN rm conf.d/* /usr/share/nginx/html/index.html
COPY packages/uploads/nginx conf.d/
EXPOSE 80
