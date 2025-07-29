FROM nginx:1.28.0-alpine3.21

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]