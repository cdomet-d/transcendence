FROM nginx:1.28.0-alpine3.21

# Import nginx default configuration for localhost:8443
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]